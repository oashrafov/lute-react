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

interface Highlights {
  general: GeneralHighlights;
  status: StatusHighlights;
}

export interface SettingsResponse {
  backup: {
    directory: string;
    enabled: boolean;
    lastDate: string;
    timeSince: string;
  };
  backup_auto: string;
  backup_count: string;
  backup_dir: string;
  backup_enabled: string;
  backup_warn: string;
  current_language_id: string;
  current_theme: string;
  custom_styles: string;
  highlights: Highlights;
  hotkey_Bookmark: string;
  hotkey_CopyPage: string;
  hotkey_CopyPara: string;
  hotkey_CopySentence: string;
  hotkey_DeleteTerm: string;
  hotkey_EditPage: string;
  hotkey_MarkRead: string;
  hotkey_MarkReadWellKnown: string;
  hotkey_NextPage: string;
  hotkey_NextSentence: string;
  hotkey_NextTheme: string;
  hotkey_NextUnknownWord: string;
  hotkey_NextWord: string;
  hotkey_PrevSentence: string;
  hotkey_PrevUnknownWord: string;
  hotkey_PrevWord: string;
  hotkey_PreviousPage: string;
  hotkey_SaveTerm: string;
  hotkey_StartHover: string;
  hotkey_Status1: string;
  hotkey_Status2: string;
  hotkey_Status3: string;
  hotkey_Status4: string;
  hotkey_Status5: string;
  hotkey_StatusDown: string;
  hotkey_StatusIgnore: string;
  hotkey_StatusUp: string;
  hotkey_StatusWellKnown: string;
  hotkey_ToggleFocus: string;
  hotkey_ToggleHighlight: string;
  hotkey_TranslatePage: string;
  hotkey_TranslatePara: string;
  hotkey_TranslateSentence: string;
  japanese_reading: string;
  lastbackup: number;
  mecab_path: string;
  open_popup_in_full_screen: string;
  open_popup_in_new_tab: boolean;
  show_highlights: boolean;
  stats_calc_sample_size: string;
  stop_audio_on_term_form_open: boolean;
  term_popup_promote_parent_translation: boolean;
  term_popup_show_components: boolean;
}

interface Shortcut {
  name: string;
  shortcuts: {
    description: string;
    key: string;
    label: string;
  }[];
}

export type ShortcutsResponse = Shortcut[];

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
