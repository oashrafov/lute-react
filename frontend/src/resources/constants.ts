import type { HighlightType, Status } from "./types";

export const BASE_API_URL = "http://localhost:5001/api";
export const FAVICON_SOURCE_URL = "http://www.google.com/s2/favicons?domain=";
export const MAX_VISIBLE_DICT_TABS = 5;
export const MAX_TERM_SUGGESTIONS = 15;
export const TERM_SUGGESTION_STR_MAX_LEN = 70;
export const MIN_LANGUAGE_DICTS = 2;
export const TABLE_PAGE_SIZE = 10;
export const FOCUS_HEADER_HEIGHT = 80;
export const TEXTITEM_CLASS = {
  textitem: "textitem",
  word: "word",
  marked: "kwordmarked",
  hovered: "wordhover",
  multi: "newmultiterm",
  flashing: "flash",
  overlapped: "overlapped",
  bookmarked: "bookmarked",
  ghosted: "ghosted",
} as const;
export const TEXTITEM_DATASET = {
  status: "status",
  sentenceStart: "sentence-start",
  sentenceId: "sentence-id",
  paragraphId: "paragraph-id",
} as const;
export const DEFAULT_TEXT_SETTINGS = {
  fontSize: 1,
  lineHeight: 1,
  columnCount: 1,
  highlights: true,
  textWidth: 50,
} as const;
export const STATUS_LABEL = {
  0: "Unknown",
  1: "New",
  2: "New",
  3: "Learning",
  4: "Learning",
  5: "Learned",
  98: "Ignored",
  99: "Well Known",
} as const satisfies Record<Status, string>;
export const DEFAULT_HIGHLIGHT_TYPE: Record<Status, HighlightType> = {
  0: "bg",
  1: "bg",
  2: "bg",
  3: "bg",
  4: "bg",
  5: "bg",
  98: "none",
  99: "none",
} as const;
