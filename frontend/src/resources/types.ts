export type Status = 0 | 1 | 2 | 3 | 4 | 5 | 98 | 99;
export type HighlightType = "bg" | "text" | "solid" | "dashed" | "none";
export type TextUnit = "sentence" | "paragraph" | "page";
export type TextDirection = "ltr" | "rtl";

export interface TextItemElement extends HTMLSpanElement {
  dataset: {
    order: string;
    highlightType: HighlightType;
  } & DOMStringMap;
}

export interface WordTextItemElement extends TextItemElement {
  dataset: {
    langId: number;
    sentenceId: number;
    paragraphId: number;
    text: string;
    wid: string;
  } & DOMStringMap &
    TextItemElement["dataset"];
}
