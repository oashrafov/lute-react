"Book endpoints"

import os
import json
from datetime import datetime

from flask import Blueprint, jsonify, send_file, current_app, request
from sqlalchemy import text as SQLText

from lute.db import db
from lute.models.book import Text, Book as BookModel
from lute.models.repositories import BookRepository
from lute.book.model import Book, Repository
from lute.book.service import (
    Service as BookService,
    BookImportException,
)
from lute.read.render.service import Service as RenderService
from lute.book.stats import Service as StatsService
from lute.utils.data_tables import supported_parser_type_criteria


bp = Blueprint("api_books", __name__, url_prefix="/api/books")


def parse_url_params():
    """
    parse table url params
    """
    # Pagination
    start = int(request.args.get("start", 0))  # Starting index
    size = int(request.args.get("size", 10))  # Page size
    # Filters
    global_filter = request.args.get("globalFilter", "").strip()
    # [{"id": "title", "value": "Book"}]
    filters = json.loads(request.args.get("filters", "[]"))
    # {"title": "contains"}
    filter_modes = json.loads(request.args.get("filterModes", "{}"))
    # Sorting [{"id": "WordCount", "desc": True}]
    sorting = json.loads(request.args.get("sorting", "[]"))

    return start, size, filters, filter_modes, global_filter, sorting


@bp.route("/", methods=["GET"])
def get_books():
    "Get all books applying filters and sorting"

    shelf = request.args.get("shelf", "active")
    start, size, filters, filter_modes, global_filter, sorting = parse_url_params()

    # Base SQL Query
    base_sql = f"""
        SELECT
            books.BkID As BkID,
            LgName,
            languages.LgRightToLeft as LgRightToLeft,
            BkLgID,
            BkSourceURI,
            BkTitle,
            BkAudioFilename,
            CASE WHEN currtext.TxID IS null then 1 else currtext.TxOrder END AS PageNum,
            textcounts.pagecount AS PageCount,
            booklastopened.lastopeneddate AS LastOpenedDate,
            BkArchived,
            tags.taglist AS TagList,
            textcounts.wc AS WordCount,
            bookstats.distinctterms AS DistinctCount,
            bookstats.distinctunknowns AS UnknownCount,
            bookstats.unknownpercent AS UnknownPercent,
            bookstats.status_distribution AS StatusDistribution,
            CASE WHEN completed_books.BkID IS null then 0 else 1 END AS IsCompleted,
            (SELECT COUNT(*) FROM books WHERE BkArchived = TRUE) AS ArchivedCount,
            (SELECT COUNT(*) FROM books) AS TotalCount
        FROM books

        INNER JOIN languages ON LgID = books.BkLgID

        LEFT OUTER JOIN texts currtext ON currtext.TxID = BkCurrentTxID

        INNER JOIN (
            select TxBkID, max(TxStartDate) as lastopeneddate from texts group by TxBkID
        ) booklastopened on booklastopened.TxBkID = books.BkID

        INNER JOIN (
            SELECT TxBkID, SUM(TxWordCount) AS wc, COUNT(TxID) AS pagecount
            FROM texts
            GROUP BY TxBkID
        ) textcounts ON textcounts.TxBkID = books.BkID

        LEFT OUTER JOIN bookstats ON bookstats.BkID = books.BkID

        LEFT OUTER JOIN (
            SELECT BtBkID AS BkID, GROUP_CONCAT(T2Text, ', ') AS taglist
            FROM (
                SELECT BtBkID, T2Text
                FROM booktags bt
                INNER JOIN tags2 t2 ON t2.T2ID = bt.BtT2ID
                ORDER BY T2Text
            ) tagssrc
            GROUP BY BtBkID
        ) AS tags ON tags.BkID = books.BkID

        LEFT OUTER JOIN (
            SELECT texts.TxBkID AS BkID
            FROM texts
            INNER JOIN (
                /* last page in each book */
                select TxBkID, max(TxOrder) AS maxTxOrder FROM texts GROUP BY TxBkID
            ) last_page ON last_page.TxBkID = texts.TxBkID AND last_page.maxTxOrder = texts.TxOrder
            WHERE TxReadDate IS NOT null
        ) completed_books ON completed_books.BkID = books.BkID

        WHERE languages.LgParserType in ({ supported_parser_type_criteria() })
    """

    if shelf == "active":
        base_sql += " AND books.BkArchived != TRUE"
    elif shelf == "archived":
        base_sql += " AND books.BkArchived = TRUE"

    # Apply Filters
    for flt in filters:
        field = flt.get("id")
        value = flt.get("value", "").strip()
        mode = filter_modes.get(field, "contains")  # Default mode: 'contains'

        if field == "title":
            if mode == "contains":
                base_sql += f" AND BkTitle LIKE '%{value}%'"
            elif mode == "startsWith":
                base_sql += f" AND BkTitle LIKE '{value}%'"
            elif mode == "endsWith":
                base_sql += f" AND BkTitle LIKE '%{value}'"

        elif field == "language":
            if mode == "contains":
                base_sql += f" AND LgName LIKE '%{value}%'"
            elif mode == "equals":
                base_sql += f" AND LgName = '{value}'"

        elif field == "tags":
            if mode == "contains":
                base_sql += f" AND TagList LIKE '%{value}%'"
            elif mode == "equals":
                base_sql += f" AND TagList = '{value}'"

        elif field == "wordCount":
            value = int(value)
            if mode == "greaterThan":
                base_sql += f" AND WordCount > {value}"
            elif mode == "lessThan":
                base_sql += f" AND WordCount < {value}"
            elif mode == "equals":
                base_sql += f" AND WordCount = {value}"
            elif mode == "notEquals":
                base_sql += f" AND WordCount != {value}"

        elif field == "status":
            value = int(value)
            if mode == "greaterThan":
                base_sql += f" AND UnknownPercent > {value}"
            elif mode == "lessThan":
                base_sql += f" AND UnknownPercent < {value}"
            elif mode == "equals":
                base_sql += f" AND UnknownPercent = {value}"
            elif mode == "notEquals":
                base_sql += f" AND UnknownPercent != {value}"

    # Apply Global Filter
    if global_filter:
        if global_filter.isdigit():
            base_sql += f""" AND (BkTitle LIKE '%{global_filter}%' OR
                            LgName LIKE '%{global_filter}%' OR
                            WordCount = {global_filter} OR
                            UnknownPercent = {global_filter}
                        )"""
        else:  # String value
            base_sql += f""" AND (
                            BkTitle LIKE '%{global_filter}%' OR
                            LgName LIKE '%{global_filter}%'
                        )"""

    # Apply Sorting
    if sorting:
        sort_clauses = []
        for sort in sorting:
            field = sort.get("id")
            desc_order = sort.get("desc", False)

            if field == "wordCount":
                sort_clauses.append(f"WordCount {'DESC' if desc_order else 'ASC'}")
            elif field == "language":
                sort_clauses.append(f"LgName {'DESC' if desc_order else 'ASC'}")
            elif field == "title":
                sort_clauses.append(f"BkTitle {'DESC' if desc_order else 'ASC'}")
            elif field == "status":
                sort_clauses.append(f"UnknownPercent {'DESC' if desc_order else 'ASC'}")
            elif field == "lastRead":
                sort_clauses.append(
                    f"LastOpenedDate {'DESC' if desc_order else 'ASC'} NULLS LAST"
                )

        # Add the ORDER BY clause
        if sort_clauses:
            base_sql += " ORDER BY " + ", ".join(sort_clauses)

    # Apply Pagination
    base_sql += f" LIMIT {size} OFFSET {start}"

    # Execute the Query
    results = db.session.execute(SQLText(base_sql)).fetchall()
    totalCount = results[0].TotalCount if results else 0
    archivedCount = results[0].ArchivedCount if results else 0
    activeCount = totalCount - archivedCount

    rowCount = totalCount
    if shelf == "active":
        rowCount = activeCount
    elif shelf == "archived":
        rowCount = archivedCount

    # Prepare Output
    response = []
    for row in results:
        response.append(
            {
                "id": row.BkID,
                "language": row.LgName,
                "languageId": row.BkLgID,
                "languageRtl": row.LgRightToLeft == 1,
                "source": row.BkSourceURI or "",
                "audioName": row.BkAudioFilename or "",
                "title": row.BkTitle,
                "wordCount": row.WordCount,
                "pageCount": row.PageCount,
                "currentPage": row.PageNum,
                "tags": row.TagList.split(",") if row.TagList else [],
                "isCompleted": row.IsCompleted,
                "unknownPercent": row.UnknownPercent,
                "isArchived": row.BkArchived,
                "lastRead": row.LastOpenedDate,
                # "DistinctCount": row.DistinctCount,
                # "UnknownCount": row.UnknownCount,
            }
        )

    return jsonify(
        {
            "data": response,
            "total": rowCount,
            "activeCount": activeCount,
            "archivedCount": archivedCount,
        }
    )


@bp.route("/<int:bookid>", methods=["GET"])
def get_book(bookid):
    "get book"

    book = _find_book(bookid)
    if book is None:
        return jsonify("No such book")

    page_num = 1
    text = book.texts[0]
    if book.current_tx_id:
        text = db.session.get(Text, book.current_tx_id)
        page_num = text.order

    book_dict = {
        "id": book.id,
        "title": book.title,
        "source": book.source_uri,
        "pageCount": book.page_count,
        "currentPage": page_num,
        "languageId": book.language.id,
        "audio": (
            {
                "name": book.audio_filename,
                "position": (
                    float(book.audio_current_pos) if book.audio_current_pos else 0
                ),
                "bookmarks": (
                    [float(x) for x in book.audio_bookmarks.split(";")]
                    if book.audio_bookmarks
                    else []
                ),
            }
            if book.audio_filename
            else None
        ),
        # mock bookmarks
        "bookmarks": {
            2: [  # page
                {
                    "id": 2,  # sentence id
                    "description": "This sentence reminds me of my chilhood",
                },
                {"id": 6, "description": "Oh, the memories"},
                {"id": 8, "description": "Are we looting?"},
            ],
            9: [
                {
                    "id": 2,
                    "description": "This sentence reminds me of my chilhood",
                },
                {"id": 5, "description": "Oh, the memories"},
                {"id": 6, "description": "Are we looting?"},
                {"id": 7, "description": "Are we looting?"},
                {"id": 8, "description": "Are we looting?"},
            ],
            12: [
                {
                    "id": 4,
                    "description": "This sentence reminds me of my chilhood",
                },
                {"id": 5, "description": "Oh, the memories"},
                {"id": 6, "description": "Are we looting?"},
                {"id": 7, "description": "Are we looting?"},
            ],
        },
    }

    return jsonify(book_dict)


@bp.route("/new", methods=["POST"])
def create_book():
    """
    create new book
    """
    data = request.form
    data = {k: None if v == "undefined" else v for k, v in data.items()}
    files_dict = request.files.to_dict()

    domain_book = Book()

    try:
        for key, value in data.items():
            if hasattr(domain_book, key):
                if value and value.isdigit():
                    value = int(value)
                setattr(domain_book, key, value)

        text_file = files_dict.get("text_file", None)
        audio_file = files_dict.get("audio_file", None)

        if text_file:
            setattr(domain_book, "text_stream", text_file.stream)
            setattr(domain_book, "text_stream_filename", text_file.filename)
        if audio_file:
            setattr(domain_book, "audio_stream", audio_file.stream)
            setattr(domain_book, "audio_stream_filename", audio_file.filename)

        svc = BookService()
        book = svc.import_book(domain_book, db.session)
        response = {"id": book.id, "title": book.title}

        return jsonify(response), 200

    except BookImportException as e:
        return jsonify(e.message), 400


@bp.route("/<int:bookid>", methods=["PATCH"])
def edit_book(bookid):
    "Edit a book"

    data = request.form
    data = {k: None if v == "undefined" else v for k, v in data.items()}

    action = data.get("action")
    if action == "archive":
        book = _find_book(bookid)
        book.archived = True

        db.session.add(book)
        db.session.commit()
        archived_count = len(
            db.session.query(BookModel).filter(BookModel.archived == 1).all()
        )

        return (
            jsonify(
                {"id": book.id, "title": book.title, "archivedCount": archived_count}
            ),
            200,
        )

    if action == "unarchive":
        book = _find_book(bookid)
        book.archived = False

        db.session.add(book)
        db.session.commit()
        archived_count = len(
            db.session.query(BookModel).filter(BookModel.archived == 1).all()
        )

        return (
            jsonify(
                {"id": book.id, "title": book.title, "archivedCount": archived_count}
            ),
            200,
        )

    if action == "edit":
        files_dict = request.files.to_dict()
        repo = Repository(db.session)
        book = repo.load(bookid)

        for key, value in data.items():
            if hasattr(book, key):
                setattr(book, key, value)

        audio_file = files_dict.get("audio_file", None)
        if audio_file:
            setattr(book, "audio_stream", audio_file.stream)
            setattr(book, "audio_stream_filename", audio_file.filename)

        svc = BookService()
        svc.import_book(book, db.session)

    if action == "markAsStale":
        book = _find_book(bookid)
        if book is None:
            return jsonify("No such book")

        _mark_book_as_stale(book)

    return jsonify({"id": book.id, "title": book.title}), 200


@bp.route("/<int:bookid>", methods=["DELETE"])
def delete_book(bookid):
    "delete a book."

    b = _find_book(bookid)

    db.session.delete(b)
    db.session.commit()

    return {"title": b.title}, 200


@bp.route("/url", methods=["POST"])
def parse_content_from_url():
    "Get data for a new book, or flash an error if can't parse."
    service = BookService()
    url = request.data.decode("utf-8")
    try:
        b = service.book_data_from_url(url)
    except BookImportException as e:
        return jsonify(e.message), 400

    response = {"title": b.title, "source_uri": b.source_uri, "text": b.text}

    return jsonify(response)


@bp.route("/<int:bookid>/pages/<int:pagenum>", methods=["GET"])
def get_page_content(bookid, pagenum):
    "get page content"
    book = _find_book(bookid)
    if book is None:
        return jsonify("No such book")

    text, paragraphs = _load_page_content(book, pagenum)

    return jsonify(
        {"text": text.text, "paragraphs": _paragraphs_to_dict_array(paragraphs)}
    )


@bp.route("/<int:bookid>/pages/<int:pagenum>", methods=["POST"])
def commit_page(bookid, pagenum):
    "commit page to db"

    book = _find_book(bookid)
    if book is None:
        return jsonify("No such book")

    text = book.text_at_page(pagenum)

    should_track = request.get_json().get("shouldTrack", True)
    _commit_session(book, text, should_track)

    return jsonify({"id": book.id}), 200


@bp.route("<int:bookid>/audio", methods=["GET"])
def stream(bookid):
    "Serve the audio, no caching."
    dirname = current_app.env_config.useraudiopath
    br = BookRepository(db.session)
    book = br.find(bookid)
    fname = os.path.join(dirname, book.audio_filename)
    return send_file(fname, as_attachment=True, max_age=0)


@bp.route("/<int:bookid>/stats", methods=["GET"])
def book_stats(bookid):
    "Calc stats for the book using the status distribution."
    book = _find_book(bookid)
    svc = StatsService(db.session)
    status_distribution = svc.calc_status_distribution(book)

    sum_words = sum(status_distribution.values())
    if sum_words == 0:
        return None

    status_distribution[99] = status_distribution.get(98, 0) + status_distribution.get(
        99, 0
    )
    status_distribution.pop(98, "")

    with_percentages = {}
    for status, words in status_distribution.items():
        pct = words / sum_words * 100
        with_percentages[status] = {"wordCount": words, "percentage": pct}

    return jsonify(with_percentages)


def _find_book(bookid):
    "Find book from db."
    br = BookRepository(db.session)
    return br.find(bookid)


def _mark_book_as_stale(dbbook):
    "mark as stale"
    svc = StatsService(db.session)
    svc.mark_stale(dbbook)


def _commit_session(dbbook, text, track_page_open=False):
    "commit current page"

    if track_page_open:
        text.start_date = datetime.now()
        dbbook.current_tx_id = text.id

    db.session.add(dbbook)
    db.session.add(text)
    db.session.commit()


def _load_page_content(dbbook, pagenum):
    "get raw text and paragraphs"

    text = dbbook.text_at_page(pagenum)
    text.load_sentences()
    lang = text.book.language
    rs = RenderService(db.session)
    paragraphs = rs.get_paragraphs(text.text, lang)

    return text, paragraphs


def _paragraphs_to_dict_array(paragraphs):
    return [
        [
            [
                {
                    "id": textitem.span_id,
                    "displayText": textitem.html_display_text,
                    "classes": getattr(textitem, "html_class_string", ""),
                    "langId": getattr(textitem, "lang_id", ""),
                    "paragraphId": textitem.paragraph_number,
                    "sentenceId": textitem.sentence_number,
                    "text": textitem.text,
                    "statusClass": textitem.status_class,
                    "order": textitem.index,
                    "wid": textitem.wo_id,
                    "isWord": textitem.is_word,
                }
                for textitem in sentence
            ]
            for sentence in paragraph
        ]
        for paragraph in paragraphs
    ]
