interface HighlightOptions {
  dark: string;
  light: string;
  type?: string;
}

export interface GeneralHighlights {
  flash: HighlightOptions;
  kwordmarked: HighlightOptions;
  multiterm: HighlightOptions;
  wordhover: HighlightOptions;
}

export interface StatusHighlights {
  [key: string]: HighlightOptions;
}

export interface Highlights {
  general: GeneralHighlights;
  status: StatusHighlights;
}

export interface SettingsForm {
  backup_enabled: boolean;
  backup_dir: string;
  last_backup_display_date: string;
  time_since_last_backup: string;
  backup_warn: boolean;
  backup_count: string;
  backup_auto: boolean;
  japanese_reading: string;
  mecab_path: string;
  open_popup_in_new_tab: boolean;
  stats_calc_sample_size: string;
  stop_audio_on_term_form_open: boolean;
  term_popup_promote_parent_translation: boolean;
  term_popup_show_components: boolean;
}

export interface ShortcutsForm {
  [key: string]: { key: string; description: string; category: string };
}

export interface AppInfoResponse {
  version: string;
  datapath: string;
  database: string;
  isDocker: boolean;
}

export interface LanguageChoice {
  name: string;
  id: number;
}

export interface InitialResponse {
  haveLanguages: boolean;
  haveBooks: boolean;
  tutorialBookId: number | null;
  languageChoices: LanguageChoice[];
  bookTags: string[] | [];
}

export interface Backup {
  lastModified: string;
  name: string;
  size: string;
}

export interface BackupsResponse {
  backups: Backup[];
  directory: string;
}
