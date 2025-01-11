"""
API endpoints
"""

import json

from flask import Blueprint, jsonify, current_app

from lute import __version__
from lute.db import db

# import lute.utils.formutils

from lute.settings.current import current_settings
from lute.models.language import Language
from lute.models.repositories import UserSettingRepository
from lute.book.model import Repository as BookRepository
from lute.db.demo import Service as DemoService
from lute.backup.service import Service as BackupService
from lute.settings.hotkey_data import hotkey_descriptions
from lute.settings.routes import _get_categorized_hotkeys

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/wipe-database")
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


@bp.route("/deactivate-demo")
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
    # language_choices = lute.utils.formutils.language_choices(
    #     db.session, "(all languages)"
    # )
    # current_language_id = lute.utils.formutils.valid_current_language_id(db.session)

    return {
        "haveLanguages": have_languages,
        "tutorialBookId": tutorial_book_id,
        "languageChoices": [
            {"name": language.name, "id": language.id}
            for language in db.session.query(Language).all()
        ],
        "bookTags": book_repo.get_book_tags(),
        # "currentLanguageId": current_language_id,
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


@bp.route("/shortcuts", methods=["GET"])
def get_shortcuts():
    """
    get shortcuts
    """
    # print(_get_categorized_hotkeys())
    # jsonify doesn't preserve order
    return {
        "descriptions": json.dumps(hotkey_descriptions()),
        "shortcuts": json.dumps(_get_categorized_hotkeys()),
    }
    # return  jsonify({"descriptions": hotkey_descriptions(), "shortcuts": _get_categorized_hotkeys()})


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
