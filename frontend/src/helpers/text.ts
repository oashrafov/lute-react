import { TEXTITEM_CLASS, TEXTITEM_DATA } from "../resources/constants";
import type {
  TextItemElement,
  TextUnit,
  WordTextItemElement,
} from "../resources/types";
import {
  addClassToElements,
  removeAllContainingClass,
  removeAllContainingClassWithTimeout,
} from "../utils/utils";

const textUnitAttr = {
  sentence: TEXTITEM_DATA.sentenceId,
  paragraph: TEXTITEM_DATA.paragraphId,
} as const;

function _partitionByParagraphId(textItems: HTMLSpanElement[]) {
  const partitioned: Record<string, HTMLSpanElement[]> = {};
  textItems.forEach((item) => {
    const id = item.dataset.paragraphId!;
    if (!partitioned[id]) {
      partitioned[id] = [];
    }
    partitioned[id].push(item);
  });
  return partitioned;
}
/** Get the text from the text items, adding "\n" between paragraphs. */
export function getTextContent(textitems: TextItemElement[]) {
  if (textitems.length === 0) return "";

  const paras = _partitionByParagraphId(textitems);
  const paratexts = Object.entries(paras).map(([, textItems]) => {
    const text = textItems.map((item) => item.textContent).join("");
    return text.replace(/\u200B/g, "");
  });

  return paratexts.join("\n").trim();
}

/** Get the textitems whose span_attribute value matches that of the
 * current active/hovered word.  If span_attribute is null, return
 * all. */
export function getMatchedTextItems(
  textitem: TextItemElement,
  unit?: Exclude<TextUnit, "page">
) {
  const single = getMarked();
  const multi = getMultiSelection();
  const hasSelection = single.length > 0 || multi.length > 0;

  if (!(textitem || hasSelection)) return [];

  // let textitems: NodeListOf<Element> = [];

  const textitems =
    single.length > 0 ? single : multi.length > 0 ? multi : [textitem];

  // single.length > 0
  //   ? (textitems = single)
  //   : multi.length > 0
  //     ? (textitems = multi)
  //     : (textitems = [textitem]);

  const elements = Array.from(textitems).toSorted(
    (a, b) => parseInt(a.dataset.order!) - parseInt(b.dataset.order!)
  );

  if (!unit) return textitems;

  const attr = textUnitAttr[unit];

  const attrValue = elements[0].getAttribute(`data-${attr}`);
  const selected = Array.from(
    document.querySelectorAll<TextItemElement>(
      `.${TEXTITEM_CLASS.textitem}[data-${attr}="${attrValue}"]`
    )
  );

  return selected;
}

export function scrollSentenceIntoView(id: number) {
  const textitems = getSentence(id);
  textitems[0].scrollIntoView({ behavior: "smooth" });
  return textitems;
}

export function getMarked() {
  return Array.from(
    document.querySelectorAll<TextItemElement>(`.${TEXTITEM_CLASS.marked}`)
  );
}

export function getHovered() {
  return Array.from(
    document.querySelectorAll<TextItemElement>(`.${TEXTITEM_CLASS.hovered}`)
  );
}

export function getMultiSelection() {
  return Array.from(
    document.querySelectorAll<TextItemElement>(`.${TEXTITEM_CLASS.multi}`)
  );
}

export function getTextitems() {
  return Array.from(
    document.querySelectorAll<TextItemElement>(`.${TEXTITEM_CLASS.textitem}`)
  );
}

export function getWords() {
  return Array.from(
    document.querySelectorAll<WordTextItemElement>(`.${TEXTITEM_CLASS.word}`)
  );
}

export function clearMarked(textitem: TextItemElement) {
  textitem.classList.remove(TEXTITEM_CLASS.marked);
}

export function clearAllMarked() {
  removeAllContainingClass(TEXTITEM_CLASS.marked);
}

export function clearAllMultiterm() {
  removeAllContainingClass(TEXTITEM_CLASS.multi);
}

export function makeMarked(textitem: TextItemElement) {
  textitem.classList.add(TEXTITEM_CLASS.marked);
}

export function makeHovered(textitem: TextItemElement) {
  textitem.classList.add(TEXTITEM_CLASS.hovered);
}

export function clearHovered(textitem: TextItemElement) {
  textitem.classList.remove(TEXTITEM_CLASS.hovered);
}

export function clearAllHovered() {
  removeAllContainingClass(TEXTITEM_CLASS.hovered);
}

export function makeMultiterm(textitems: TextItemElement[]) {
  addClassToElements(textitems, TEXTITEM_CLASS.multi);
}

export function isMarked(textitem: TextItemElement) {
  return textitem.classList.contains(TEXTITEM_CLASS.marked);
}

export function isTextitem(element: HTMLElement) {
  return element.classList.contains(TEXTITEM_CLASS.textitem);
}

export function makeFlashing(textitems: TextItemElement[]) {
  addClassToElements(textitems, TEXTITEM_CLASS.flashing);
}

export function clearAllFlashing() {
  removeAllContainingClassWithTimeout(TEXTITEM_CLASS.flashing);
}

export function makeBookmarked(
  textitems: TextItemElement[] | NodeListOf<HTMLElement>
) {
  addClassToElements(textitems, TEXTITEM_CLASS.bookmarked);
}

export function clearBookmarked(
  textitems: TextItemElement[] | NodeListOf<HTMLElement>
) {
  textitems.forEach((t) => t.classList.remove(TEXTITEM_CLASS.bookmarked));
}

export function getSentence(id: number) {
  return Array.from(
    document.querySelectorAll<TextItemElement>(
      `[data-${TEXTITEM_DATA.sentenceId}="${id}"]`
    )
  );
}

export function makeGhosted(
  textitems: TextItemElement[] | NodeListOf<HTMLElement>
) {
  return addClassToElements(textitems, TEXTITEM_CLASS.ghosted);
}

export function clearGhosted(
  textitems: TextItemElement[] | NodeListOf<HTMLElement>
) {
  textitems.forEach((t) => t.classList.remove(TEXTITEM_CLASS.ghosted));
}
