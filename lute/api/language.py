"""
Languages endpoints
"""

from urllib.parse import urlparse, quote
from flask import Blueprint, jsonify, request

from sqlalchemy import text as SQLText
from lute.parse.registry import supported_parsers

from lute.db import db
from lute.models.language import Language as LanguageModel
from lute.language.service import Service as LangService
from lute.models.repositories import LanguageRepository

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

    return jsonify(languages), 200


@bp.route("/predefined", methods=["GET"])
def get_predefined_languages():
    "get predefined language names only"

    service = LangService(db.session)
    all_predefined = service.supported_predefined_languages()
    existing_langs = db.session.query(LanguageModel).all()
    existing_names = [l.name for l in existing_langs]
    filtered = [p for p in all_predefined if p.name not in existing_names]

    return jsonify([language.name for language in filtered])


@bp.route("/", methods=["POST"])
def create_language():
    "Create a predefined language and its stories."

    data = request.get_json()

    if data["loadStories"]:
        service = LangService(db.session)
        lang_id = service.load_language_def(data["name"])

        return jsonify({"id": lang_id}), 200

    return jsonify(None)


@bp.route("/new/", defaults={"langname": None}, methods=["GET"])
@bp.route("/new/<string:langname>", methods=["GET"])
def new_language(langname=None):
    "get language"

    language = LanguageModel()
    if langname is not None:
        service = LangService(db.session)
        predefined = service.supported_predefined_languages()
        candidates = [lang for lang in predefined if lang.name == langname]
        if len(candidates) == 1:
            language = candidates[0]

    return jsonify(language.to_dict())


@bp.route("/<int:langid>/settings", methods=["GET"])
def get_existing_lang_settings(langid):
    """
    get existing language form data
    """

    if not langid:
        return jsonify("Language does not exist")

    language = db.session.get(LanguageModel, langid)
    return jsonify(language.to_dict())


@bp.route("/<int:langid>", methods=["GET"])
def get_existing_lang_info(langid):
    """
    get existing language data
    to create dict tabs, book view and term form
    """

    language = db.session.get(LanguageModel, langid)
    lang_repo = LanguageRepository(db.session)
    term_dicts = lang_repo.all_dictionaries()[langid]["term"]
    sentence_dicts = lang_repo.all_dictionaries()[langid]["sentence"]

    term_dicts = [
        _get_dict_info(dict, index, langid) for index, dict in enumerate(term_dicts)
    ]
    sentence_dicts = [
        _get_dict_info(dict, index, langid) for index, dict in enumerate(sentence_dicts)
    ]

    return jsonify(
        {
            "id": langid,
            "isRightToLeft": language.right_to_left,
            "showPronunciation": language.show_romanization,
            "dictionaries": {"term": term_dicts, "sentence": sentence_dicts},
        }
    )


@bp.route("/parsers", methods=["GET"])
def get_parsers():
    return jsonify([{"value": a[0], "label": a[1].name()} for a in supported_parsers()])


def _get_dict_info(dictURL, dictID, langid):
    url = dictURL.replace("*", "")
    # label = url if len(url) <= 10 else f"{url[:10]}..."
    hostname = urlparse(url).hostname
    label = hostname.split("www.")[-1] if hostname.startswith("www.") else hostname

    if "www.bing.com" in url:
        bing_hash = url.replace("https://www.bing.com/images/search?", "")
        url = "http://localhost:5001/bing/search/{}/###/{}".format(
            langid, quote(bing_hash, safe="()*!.'")
        )

    return {
        "id": dictID,
        "url": url,
        "label": label,
        "isExternal": dictURL[0] == "*",
        "hostname": hostname,
    }
