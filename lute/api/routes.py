"""
API endpoints
"""

from flask import Blueprint, current_app

from lute import __version__
from lute.db import db

from lute.settings.current import current_settings
from lute.models.book import Book
from lute.models.language import Language
from lute.models.setting import UserSetting
from lute.models.repositories import UserSettingRepository
from lute.book.model import Repository as BookRepository
from lute.db.demo import Service as DemoService
from lute.backup.service import Service as BackupService
from lute.settings.hotkey_data import categorized_hotkeys, hotkey_descriptions

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

    return response, 200


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

    return response, 200


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

    return {
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


@bp.route("/settings/form", methods=["GET"])
def user_settings():
    """
    settings
    """

    settings_form_values = {
        "open_popup_in_new_tab",
        "stop_audio_on_term_form_open",
        "stats_calc_sample_size",
        "term_popup_promote_parent_translation",
        "term_popup_show_components",
        "mecab_path",
        "japanese_reading",
    }

    form_settings = {
        k: v for k, v in current_settings.items() if k in settings_form_values
    }

    bs = _get_backup_settings()
    backup_settings = {
        "backup_enabled": bs.backup_enabled,
        "backup_dir": bs.backup_dir,
        "last_backup_display_date": bs.last_backup_display_date,
        "time_since_last_backup": bs.time_since_last_backup,
        "backup_warn": bs.backup_warn,
        "backup_count": bs.backup_count,
        "backup_auto": bs.backup_auto,
    }

    settings = form_settings | backup_settings

    return settings


@bp.route("/theme/form", methods=["GET", "POST"])
def highlights():
    """
    theme highlights
    """
    # temporary mock data
    return {
        "highlights": {
            "status": {
                0: {"light": "#addfff", "dark": "#5cacf3", "type": "bg"},
                1: {"light": "#f5b8a9", "dark": "#e68f79", "type": "bg"},
                2: {"light": "#f5cca9", "dark": "#efa96d", "type": "bg"},
                3: {"light": "#f5e1a9", "dark": "#f3cd64", "type": "bg"},
                4: {"light": "#f5f3a9", "dark": "#fcac67", "type": "bg"},
                5: {"light": "#ddffdd", "dark": "#7ae07a", "type": "bg"},
                98: {"light": "#ee8577", "dark": "#ee8577", "type": "none"},
                99: {"light": "#51cf66", "dark": "#51cf66", "type": "none"},
            },
            "general": {
                "kwordmarked": {
                    "light": "#228be6",
                    "dark": "#228be6",
                },
                "wordhover": {
                    "light": "#f56767",
                    "dark": "#f56767",
                },
                "multiterm": {"light": "#ffe066", "dark": "#ffe066"},
                "flash": {"light": "#ff6868", "dark": "#ff6868"},
            },
        }
    }


@bp.route("/shortcuts", methods=["GET", "POST"])
def shortcuts():
    """
    shortcuts
    """
    categorized = categorized_hotkeys()
    descriptions = hotkey_descriptions()
    settings = {h.key: h.value for h in db.session.query(UserSetting).all()}

    return {
        id: {"key": settings[id], "category": category, "description": descriptions[id]}
        for category, ids in categorized.items()
        for id in ids
    }


@bp.route("/appinfo")
def version():
    """
    app version
    """
    ac = current_app.env_config
    return {
        "version": __version__,
        "datapath": ac.datapath,
        "database": ac.dbfilename,
        "isDocker": ac.is_docker,
    }


def _get_backup_settings():
    us_repo = UserSettingRepository(db.session)
    return us_repo.get_backup_settings()
