export type UserLanguagesList = UserLanguagesItem[];

export interface UserLanguagesItem {
  bookCount: number;
  id: number;
  name: string;
  termCount: number;
}

export interface UserLanguageDetail extends LanguageForm {
  id: number;
  name: string;
}

export interface Dictionary {
  id: number;
  active: boolean;
  for: "terms" | "sentences";
  hostname: string;
  label: string;
  type: "embedded" | "popup";
  url: string;
}
export interface LanguageForm {
  character_substitutions: string;
  parser_type: string;
  right_to_left: boolean;
  show_romanization: boolean;
  split_sentence_exceptions: string;
  split_sentences: string;
  word_chars: string;
  dictionaries: Dictionary[];
}
