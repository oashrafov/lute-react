import type { TextDirection } from "#resources/types";

export type UserLanguagesList = UserLanguagesItem[];

export interface UserLanguagesItem {
  id: number;
  name: string;
  textDirection: TextDirection;
  bookCount: number;
  termCount: number;
}

export interface UserLanguageDetail extends LanguageForm {
  id: number;
  name: string;
}

export interface PredefinedLanguageDetail extends LanguageForm {
  id: null;
  name: string;
}

export interface LanguageParser {
  label: string;
  value: string;
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
