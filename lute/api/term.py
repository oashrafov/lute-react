"Term endpoints"

import os
import csv
import json

from flask import Blueprint, send_file, current_app, request
from sqlalchemy import text as SQLText

from lute.db import db
from lute.read.service import Service as ReadService
from lute.term.model import Repository
from lute.utils.data_tables import supported_parser_type_criteria
from lute.api.utils.utils import get_filter, parse_url_params
from lute.api.sql.term import terms as terms_base_sql
from lute.api.sql.term import tags as tags_base_sql


bp = Blueprint("api_terms", __name__, url_prefix="/api/terms")


@bp.route("/", methods=["GET"])
def get_terms():
    "term json data for table."

    start, size, filters, filter_modes, global_filter, sorting = parse_url_params(
        request
    )

    where = [f"WHERE LgParserType in ({ supported_parser_type_criteria() })"]

    if request.args.get("parentsOnly", "false") == "true":
        where.append("AND ParentText IS NULL")

    ids = json.loads(request.args.get("ids", "[]"))
    if ids:
        ids_str = ", ".join(map(str, ids))
        parentsql = f"select WpParentWoID from wordparents where WpWoID in ({ids_str})"  # FIX - parent terms don't get filtered (for status specifically)
        where.append(f" AND (WordID IN ({ids_str})) OR (WordID IN ({parentsql}))")

    fields = {
        "text": "WoText",
        "parentsString": "ParentText",
        "translation": "WoTranslation",
        "language": "LgName",
        "status": "StID",
        "createdOn": "WoCreated",
        "tagsString": "TagList",
    }

    for flt in filters:
        field = flt.get("id")
        value = flt.get("value", "")
        mode = filter_modes.get(field, "contains")

        if field in fields and field not in ("status", "createdOn"):
            where.append(get_filter(mode, fields[field], value))

        if field == "status":
            value0 = value[0]
            value1 = value[1]
            statuses = [0, 1, 2, 3, 4, 5, 99, 98]

            if value0 == value1:
                where.append(f" AND StID = {statuses[value0]}")
                continue

            status_range = statuses[value0 : value1 + 1]
            where.append(f" AND StID IN ({', '.join(map(str, status_range))})")

        elif field == "createdOn":
            value0 = value[0]
            value1 = value[1]

            if not value0 and not value1:
                continue

            where.append(f" AND WoCreated BETWEEN '{value0}' AND '{value1}'")

    if global_filter:
        if global_filter.isdigit():
            where.append(
                f""" AND (WoCreated LIKE '%{global_filter}%' OR
                            StID = {global_filter}
                        )"""
            )
        else:
            where.append(
                f""" AND (
                            WoText LIKE '%{global_filter}%' OR
                            ParentText LIKE '%{global_filter}%' OR
                            WoTranslation LIKE '%{global_filter}%' OR
                            LgName LIKE '%{global_filter}%'
                        )"""
            )

    # initial sorting (status filtering messes up default sorting)
    sort_clauses = ["WoCreated DESC"]
    if sorting:
        sort_clauses = []
        for sort in sorting:
            field = sort.get("id")
            desc_order = sort.get("desc", False)

            if field in fields:
                sort_clauses.append(
                    f"{fields[field]} {'DESC' if desc_order else 'ASC'} NULLS LAST"
                )

    order_by = " ORDER BY " + ", ".join(sort_clauses)

    limit = ""
    if size != -1:
        limit = f" LIMIT {size} OFFSET {start}"

    realbase = f"({terms_base_sql}) realbase".replace("\n", " ")
    total = """
            SELECT COUNT(*) AS TotalTermCount
            FROM words
            """

    filtered = f"SELECT COUNT(*) FROM {realbase} {" ".join(where)}"
    final_query = f"{terms_base_sql} {" ".join(where)} {order_by} {limit}"

    filtered_count = db.session.execute(SQLText(filtered)).scalar()
    total_count = db.session.execute(SQLText(total)).scalar()
    results = db.session.execute(SQLText(final_query)).fetchall()

    response = []
    for row in results:
        response.append(
            {
                "id": row.WordID,
                "language": row.LgName,
                "languageId": row.LgID,
                "textDirection": "rtl" if row.LgRightToLeft == 1 else "ltr",
                "text": row.WoText,
                "parentsString": row.ParentText,
                "translation": row.WoTranslation,
                "romanization": row.WoRomanization,
                "statusId": row.StID,
                "image": row.WiSource,
                "createdOn": row.WoCreated,
                "tagsString": row.TagList,
                # "statusLabel": row.StText,
            }
        )

    return {
        "data": response,
        "totalCount": total_count,
        "filteredCount": filtered_count,
    }


@bp.route("/tags", methods=["GET"])
def get_term_tags():
    "json data for term tags."

    results = db.session.execute(SQLText(tags_base_sql)).fetchall()

    response = []
    for row in results:
        response.append(
            {
                "id": row.TgID,
                "text": row.TgText,
                "termCount": row.TermCount,
                "comment": row.TgComment,
            }
        )

    return response


@bp.route("/export", methods=["GET"])
def export_terms():
    "Generate export file of terms."
    # !!! NEED TO GET ALL DATA, NOT FILTERED OR PAGINATED (OR CAN USE PARAMS FOR CUSTOM EXPORT)
    export_file = os.path.join(current_app.env_config.temppath, "terms.csv")
    response = get_terms()
    term_data = response.get_json()
    # Term data is an array of dicts, with the sql field name as dict
    # keys.  These need to be mapped to headings.
    heading_to_fieldname = {
        "Term": "text",
        "Parent": "parentText",
        "Translation": "translation",
        "Language": "language",
        "Status": "statusLabel",
        "Added on": "createdOn",
        "Pronunciation": "romanization",
    }

    headings = heading_to_fieldname.keys()
    output_data = [
        [r[heading_to_fieldname[fieldname]] for fieldname in headings]
        for r in term_data
    ]
    with open(export_file, "w", encoding="utf-8", newline="") as f:
        csv_writer = csv.writer(f)
        csv_writer.writerow(headings)
        csv_writer.writerows(output_data)

    return send_file(export_file, as_attachment=True)


@bp.route("/<int:termid>", methods=["GET"])
def get_term_by_id(termid):
    "single word term"

    repo = Repository(db.session)
    term = repo.load(termid)

    return _term_to_dict(term)


@bp.route("/<text>/<int:langid>", methods=["GET"])
def get_term_by_text(langid, text):
    "multi word term"

    usetext = text.replace("LUTESLASH", "/")
    repo = Repository(db.session)
    term = repo.find_or_new(langid, usetext)

    return _term_to_dict(term)


@bp.route("/", methods=["POST"])
def create_term():
    "create term"

    data = request.get_json()
    # text = data.get("text")
    text = data.get("langId")

    print(data)

    # usetext = text.replace("LUTESLASH", "/")
    # repo = Repository(db.session)
    # term = repo.find_or_new(langid, usetext)

    # print(term, "ID")

    return {"text": text}


@bp.route("/<int:termid>", methods=["PUT"])
def edit_term(termid):
    "edit term"

    print(request.data)

    return {"id": termid}


@bp.route("/<int:termid>", methods=["DELETE"])
def delete_term(termid):
    "delete term"

    print(request.data)

    return {"id": termid}


@bp.route("<int:termid>/popup", methods=["GET"])
def get_term_popup(termid):
    """
    get popup content for the given term id
    """
    service = ReadService(db.session)
    d = service.get_popup_data(termid)

    if d is None:
        return None

    return {
        "text": d.term_and_parents_text(),
        "parents": [
            {
                "text": item.term_text,
                "translation": item.translation,
                "pronunciation": item.romanization,
                "tags": item.tags,
            }
            for item in d.parents
        ],
        "components": [
            {
                "text": item.term_text,
                "translation": item.translation,
                "pronunciation": item.romanization,
                "tags": item.tags,
            }
            for item in d.components
        ],
        "pronunciation": d.romanization,
        "translation": d.translation,
        "tags": d.tags,
        "images": d.popup_image_data,
    }


@bp.route("/<text>/<int:langid>/sentences", methods=["GET"])
def get_sentences(langid, text):
    "Get sentences for terms."

    repo = Repository(db.session)
    t = repo.find_or_new(langid, text)
    refs = repo.find_references(t)

    # Transform data for output, to
    # { "term": [refs], "children": [refs], "parent1": [refs], "parent2" ... }
    refdata = [(f'"{text}"', refs["term"]), (f'"{text}" child terms', refs["children"])]
    for p in refs["parents"]:
        refdata.append((f"\"{p['term']}\"", p["refs"]))

    refcount = sum(len(ref[1]) for ref in refdata)
    variations = [
        {
            "term": k,
            "references": [
                {
                    "id": dtos.index(dto),
                    "sentence": dto.sentence,
                    "bookId": dto.book_id,
                    "bookTitle": dto.title,
                    "pageNumber": dto.page_number,
                }
                for dto in dtos
            ],
        }
        for k, dtos in refdata
    ]

    return {"text": text, "variations": variations if refcount > 0 else []}


@bp.route("/<text>/<int:langid>/suggestions", methods=["GET"])
def get_term_suggestions(text, langid):
    "term suggestions for parent data"

    if text.strip() == "" or langid == 0:
        return []

    repo = Repository(db.session)
    matches = repo.find_matches(langid, text)

    result = [
        {
            "id": t.id,
            "text": t.text,
            "translation": t.translation,
            "status": t.status,
        }
        for t in matches
    ]

    return result


@bp.route("/tags/suggestions", methods=["GET"])
def get_tag_suggestions():
    "tag suggestions"

    repo = Repository(db.session)
    return repo.get_term_tags()


def _term_to_dict(term):
    if term.status == 0:
        term.status = 1

    return {
        "id": term.id,
        "text": term.text or "",
        "textLC": term.text_lc or "",
        "originalText": term.original_text or "",
        "status": term.status,
        "translation": term.translation or "",
        "romanization": term.romanization or "",
        "syncStatus": term.sync_status,
        "termTags": term.term_tags,
        "parents": term.parents,
        "currentImg": term.current_image,
    }
