export type Status = 0 | 1 | 2 | 3 | 4 | 5 | 98 | 99;
export type HighlightType = "bg" | "text" | "solid" | "dashed" | "none";
export type TextUnit = "sentence" | "paragraph" | "page";
export type TextDirection = "ltr" | "rtl";
export type View = "default" | "focus" | "edit";
export type LocalStorageItem =
  | "Lute.view"
  | "Lute.highlights"
  | "Lute.highlightType"
  | "Lute.fontSize"
  | "Lute.lineHeight"
  | "Lute.textWidth"
  | "Lute.columnCount"
  | "Lute.booksTable.pinnedRows";

export interface TextitemElement extends HTMLSpanElement {
  dataset: {
    order: string;
  } & DOMStringMap;
}

export interface WordElement extends TextitemElement {
  dataset: {
    langId: number;
    sentenceId: number;
    paragraphId: number;
    text: string;
    wordId: string;
    highlightType: HighlightType;
  } & DOMStringMap &
    TextitemElement["dataset"];
}
