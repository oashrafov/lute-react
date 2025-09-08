"""
Languages endpoints
"""

from urllib.parse import urlparse
from flask import Blueprint, request

from sqlalchemy import text as SQLText
from lute.parse.registry import supported_parsers

from lute.db import db
from lute.models.language import Language as LanguageModel
from lute.language.service import Service as LangService

bp = Blueprint("api_languages", __name__, url_prefix="/api/languages")


@bp.route("/user", methods=["GET"])
def get_user_languages():
    "get user defined languages"

    sql = """
        select LgID, LgName, book_count, term_count from languages
        left outer join (
        select BkLgID, count(BkLgID) as book_count from books
        group by BkLgID
        ) bc on bc.BkLgID = LgID
        left outer join (
        select WoLgID, count(WoLgID) as term_count from words
        where WoStatus != 0
        group by WoLgID
        ) tc on tc.WoLgID = LgID
        order by LgName
        """

    result = db.session.execute(SQLText(sql)).all()
    languages = [
        {
            "id": row[0],
            "name": row[1],
            "bookCount": row[2] or 0,
            "termCount": row[3] or 0,
        }
        for row in result
    ]

    return languages, 200


@bp.route("/predefined", methods=["GET"])
def get_predefined_languages():
    "get predefined language names only"

    service = LangService(db.session)
    all_predefined = service.supported_predefined_languages()
    existing_langs = db.session.query(LanguageModel).all()
    existing_names = [l.name for l in existing_langs]
    filtered = [p for p in all_predefined if p.name not in existing_names]

    return [language.name for language in filtered]


@bp.route("/", methods=["POST"])
def create_language():
    "Create a predefined language and its stories."

    data = request.get_json()

    if data["loadStories"]:
        service = LangService(db.session)
        lang_id = service.load_language_def(data["name"])

        return {"id": lang_id}, 200

    return None


@bp.route("/predefined/<string:langname>", methods=["GET"])
def get_predefined_language(langname):
    "get predefined language form data"

    if langname is None:
        return None

    service = LangService(db.session)
    predefined = service.supported_predefined_languages()
    candidates = [lang for lang in predefined if lang.name == langname]
    if len(candidates) == 1:
        language = candidates[0]
    else:
        return None

    return _lang_to_dict(language)


@bp.route("/user/<int:langid>", methods=["GET"])
def get_user_language(langid):
    """
    get existing language form data
    """

    if not langid:
        return "Language does not exist"

    language = db.session.get(LanguageModel, langid)

    return _lang_to_dict(language)


@bp.route("/parsers", methods=["GET"])
def get_parsers():
    return [{"value": a[0], "label": a[1].name()} for a in supported_parsers()]


@bp.route("/form", methods=["GET"])
def get_language_form():
    """
    default language form settings
    """
    empty_dict = {
        "active": True,
        "for": "terms",
        "type": "embedded",
        "url": "",
        "label": "",
        "hostname": "",
    }

    return {
        "character_substitutions": "´='|`='|’='|‘='|...=…|..=‥",
        "split_sentences": ".!?",
        "split_sentence_exceptions": "Mr.|Mrs.|Dr.|[A-Z].|Vd.|Vds.",
        "word_chars": "a-zA-ZÀ-ÖØ-öø-ȳáéíóúÁÉÍÓÚñÑ",
        "right_to_left": False,
        "show_romanization": False,
        "parser_type": "spacedel",
        "dictionaries": [empty_dict, empty_dict],
    }


def _lang_to_dict(language):
    ret = {}
    ret["id"] = language.id
    ret["name"] = language.name
    ret["show_romanization"] = language.show_romanization
    ret["right_to_left"] = language.right_to_left
    ret["parser_type"] = language.parser_type
    ret["character_substitutions"] = language.character_substitutions
    ret["split_sentences"] = language.regexp_split_sentences
    ret["split_sentence_exceptions"] = language.exceptions_split_sentences
    ret["word_chars"] = language.word_characters
    ret["dictionaries"] = []
    for d in language.dictionaries:
        url = d.dicturi
        hostname = urlparse(url).hostname
        dictionary = {
            "for": d.usefor,
            "type": d.dicttype.replace("html", ""),
            "url": url,
            "active": d.is_active,
            "hostname": hostname,
            "label": (
                hostname.split("www.")[-1] if hostname.startswith("www.") else hostname
            ),
        }
        ret["dictionaries"].append(dictionary)

    return ret
