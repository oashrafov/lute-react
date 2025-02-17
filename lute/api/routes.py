"""
API endpoints
"""

from flask import Blueprint, jsonify, current_app

from lute import __version__
from lute.db import db

# import lute.utils.formutils

from lute.settings.current import current_settings
from lute.models.book import Book
from lute.models.language import Language
from lute.models.setting import UserSetting
from lute.models.repositories import UserSettingRepository
from lute.book.model import Repository as BookRepository
from lute.db.demo import Service as DemoService
from lute.backup.service import Service as BackupService

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/settings/db", methods=["DELETE"])
def wipe_db():
    """
    wipe demo database
    """
    response = ""
    demosvc = DemoService(db.session)
    if demosvc.contains_demo_data():
        demosvc.delete_demo_data()

        response = {
            "message": "Success",
        }

    return jsonify(response), 200


@bp.route("/settings/db", methods=["PATCH"])
def deactivate_demo():
    """
    deactivate demo mode
    """
    response = ""
    demosvc = DemoService(db.session)
    if demosvc.contains_demo_data():
        demosvc.remove_flag()

        response = {
            "message": "Success",
        }

    return jsonify(response), 200


@bp.route("/initial", methods=["GET"])
def initialize():
    """
    settings for initial run
    """
    book_repo = BookRepository(db.session)
    demosvc = DemoService(db.session)

    tutorial_book_id = demosvc.tutorial_book_id()
    have_languages = len(db.session.query(Language).all()) > 0
    have_books = len(db.session.query(Book).all()) > 0

    return {
        "haveLanguages": have_languages,
        "haveBooks": have_books,
        "tutorialBookId": tutorial_book_id,
        "languageChoices": [
            {"name": language.name, "id": language.id}
            for language in db.session.query(Language).all()
        ],
        "bookTags": book_repo.get_book_tags(),
    }


@bp.route("/backups", methods=["GET"])
def get_backup_list():
    "get backups list"

    bs = _get_backup_settings()
    service = BackupService(db.session)
    backups = service.list_backups(bs.backup_dir)
    backups.sort(reverse=True)

    return jsonify(
        {
            "backups": [
                {
                    "name": backup.name,
                    "size": backup.size,
                    "lastModified": backup.last_modified.strftime("%Y-%m-%d %H:%M:%S"),
                }
                for backup in backups
            ],
            "directory": bs.backup_dir,
        }
    )


@bp.route("/settings", methods=["GET"])
def user_settings():
    """
    settings
    """

    bs = _get_backup_settings()

    # temporary mock data
    highlights = {
        "highlights": {
            "status": {
                "status0": {"light": "#addfff", "dark": "#5cacf3", "type": "bg"},
                "status1": {"light": "#f5b8a9", "dark": "#e68f79", "type": "bg"},
                "status2": {"light": "#f5cca9", "dark": "#efa96d", "type": "bg"},
                "status3": {"light": "#f5e1a9", "dark": "#f3cd64", "type": "bg"},
                "status4": {"light": "#f5f3a9", "dark": "#fcac67", "type": "bg"},
                "status5": {"light": "#ddffdd", "dark": "#7ae07a", "type": "bg"},
                "status98": {"light": "#ee8577", "dark": "#ee8577", "type": "none"},
                "status99": {"light": "#51cf66", "dark": "#51cf66", "type": "none"},
            },
            "general": {
                "kwordmarked": {"light": "#228be6", "dark": "#228be6", "type": "solid"},
                "wordhover": {"light": "#f56767", "dark": "#f56767", "type": "solid"},
                "multiterm": {"light": "#ffe066", "dark": "#ffe066", "type": "bg"},
                "flash": {"light": "#ff6868", "dark": "#ff6868", "type": "bg"},
            },
        }
    }

    settings = current_settings | highlights

    settings["backup"] = {
        "enabled": bs.backup_enabled,
        "directory": bs.backup_dir,
        "lastDate": bs.last_backup_display_date,
        "timeSince": bs.time_since_last_backup,
    }

    return jsonify(settings)


@bp.route("/shortcuts", methods=["GET", "POST"])
def keys():
    """
    Return hotkey UserSetting keys and values,
    grouped by category.
    """

    categorized_settings = [
        {
            "Navigation": [
                "hotkey_StartHover",
                "hotkey_PrevWord",
                "hotkey_NextWord",
                "hotkey_PrevUnknownWord",
                "hotkey_NextUnknownWord",
                "hotkey_PrevSentence",
                "hotkey_NextSentence",
            ]
        },
        {
            "Update status": [
                "hotkey_Status1",
                "hotkey_Status2",
                "hotkey_Status3",
                "hotkey_Status4",
                "hotkey_Status5",
                "hotkey_StatusIgnore",
                "hotkey_StatusWellKnown",
                "hotkey_StatusUp",
                "hotkey_StatusDown",
                "hotkey_DeleteTerm",
            ]
        },
        {
            "Translate": [
                "hotkey_TranslateSentence",
                "hotkey_TranslatePara",
                "hotkey_TranslatePage",
            ]
        },
        {
            "Copy": [
                "hotkey_CopySentence",
                "hotkey_CopyPara",
                "hotkey_CopyPage",
            ]
        },
        {
            "Misc": [
                "hotkey_Bookmark",
                "hotkey_EditPage",
                "hotkey_NextTheme",
                "hotkey_ToggleHighlight",
                "hotkey_ToggleFocus",
            ]
        },
    ]

    setting_descs = {
        "hotkey_StartHover": "Deselect all words",
        "hotkey_PrevWord": "Move to previous word",
        "hotkey_NextWord": "Move to next word",
        "hotkey_PrevUnknownWord": "Move to previous unknown word",
        "hotkey_NextUnknownWord": "Move to next unknown word",
        "hotkey_PrevSentence": "Move to previous sentence",
        "hotkey_NextSentence": "Move to next sentence",
        "hotkey_StatusUp": "Bump up by 1",
        "hotkey_StatusDown": "Bump down by 1",
        "hotkey_Bookmark": "Bookmark the current page",
        "hotkey_CopySentence": "Sentence of the current word",
        "hotkey_CopyPara": "Paragraph of the current word",
        "hotkey_CopyPage": "Full page",
        "hotkey_TranslateSentence": "Sentence of the current word",
        "hotkey_TranslatePara": "Paragraph of the current word",
        "hotkey_TranslatePage": "Full page",
        "hotkey_NextTheme": "Cycle theme",
        "hotkey_ToggleHighlight": "Toggle highlights",
        "hotkey_ToggleFocus": "Toggle focus mode",
        "hotkey_Status1": "Set to 1",
        "hotkey_Status2": "Set to 2",
        "hotkey_Status3": "Set to 3",
        "hotkey_Status4": "Set to 4",
        "hotkey_Status5": "Set to 5",
        "hotkey_StatusIgnore": "Set to Ignore",
        "hotkey_StatusWellKnown": "Set to Well Known",
        "hotkey_DeleteTerm": "Set to Unknown (Delete term)",
        "hotkey_EditPage": "Edit the current page",
    }

    settings = {h.key: h.value for h in db.session.query(UserSetting).all()}
    return jsonify(
        [
            {
                "name": category,
                "shortcuts": [
                    {
                        "label": setting_descs[key],
                        "key": settings[key],
                        "description": key,
                    }
                    for key in keylist
                ],
            }
            for entry in categorized_settings
            for category, keylist in entry.items()
        ]
    )


#
@bp.route("/appinfo")
def version():
    """
    app version
    """
    ac = current_app.env_config
    return jsonify(
        {
            "version": __version__,
            "datapath": ac.datapath,
            "database": ac.dbfilename,
            "isDocker": ac.is_docker,
        }
    )


def _get_backup_settings():
    us_repo = UserSettingRepository(db.session)
    return us_repo.get_backup_settings()
