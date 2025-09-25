import { TEXTITEM_CLASS, TEXTITEM_DATASET } from "../resources/constants";
import type {
  TextitemElement,
  TextUnit,
  WordElement,
} from "../resources/types";
import {
  addClassToElements,
  removeAllContainingClass,
  removeAllContainingClassWithTimeout,
} from "../utils/utils";

const textUnitAttr = {
  sentence: TEXTITEM_DATASET.sentenceId,
  paragraph: TEXTITEM_DATASET.paragraphId,
} as const;

function _partitionByParagraphId(textitems: TextitemElement[]) {
  const partitioned: Record<string, TextitemElement[]> = {};
  textitems.forEach((item) => {
    const id = item.dataset.paragraphId!;
    if (!partitioned[id]) {
      partitioned[id] = [];
    }
    partitioned[id].push(item);
  });
  return partitioned;
}

export function getTextContent(textitems: TextitemElement[]) {
  if (textitems.length === 0) return "";

  const paras = _partitionByParagraphId(textitems);
  const paratexts = Object.entries(paras).map(([, textitems]) => {
    const text = textitems.map((item) => item.textContent).join("");
    return text.replace(/\u200B/g, "");
  });

  return paratexts.join("\n").trim();
}

/** Get the textitems whose span_attribute value matches that of the
 * current active/hovered word.  If span_attribute is null, return
 * all. */
export function getMatchedTextitems(
  textitem: TextitemElement,
  unit?: Exclude<TextUnit, "page">
) {
  const single = getMarked();
  const multi = getMultiSelection();
  const hasSelection = single.length > 0 || multi.length > 0;

  if (!(textitem || hasSelection)) return [];

  const textitems =
    single.length > 0 ? single : multi.length > 0 ? multi : [textitem];

  if (!unit) return textitems;

  const textitemsSorted = textitems.toSorted(
    (a, b) => Number(a.dataset.order!) - Number(b.dataset.order!)
  );

  const attr = textUnitAttr[unit];
  const attrValue = textitemsSorted[0].getAttribute(`data-${attr}`);
  const selected = document.querySelectorAll<TextitemElement>(
    `.${TEXTITEM_CLASS.textitem}[data-${attr}="${attrValue}"]`
  );

  return Array.from(selected);
}

export function scrollSentenceIntoView(id: number) {
  const textitems = getSentence(id);
  textitems[0].scrollIntoView({ behavior: "smooth" });
  return textitems;
}

export function getMarked() {
  return Array.from(
    document.querySelectorAll<WordElement>(`.${TEXTITEM_CLASS.marked}`)
  );
}

export function getHovered() {
  return Array.from(
    document.querySelectorAll<WordElement>(`.${TEXTITEM_CLASS.hovered}`)
  );
}

export function getMultiSelection() {
  return Array.from(
    document.querySelectorAll<TextitemElement>(`.${TEXTITEM_CLASS.multi}`)
  );
}

export function getTextitems() {
  return Array.from(
    document.querySelectorAll<TextitemElement>(`.${TEXTITEM_CLASS.textitem}`)
  );
}

export function getWords() {
  return Array.from(
    document.querySelectorAll<WordElement>(`.${TEXTITEM_CLASS.word}`)
  );
}

export function clearMarked(textitem: WordElement) {
  textitem.classList.remove(TEXTITEM_CLASS.marked);
}

export function clearAllMarked() {
  removeAllContainingClass(TEXTITEM_CLASS.marked);
}

export function clearAllMultiterm() {
  removeAllContainingClass(TEXTITEM_CLASS.multi);
}

export function makeMarked(textitem: WordElement) {
  textitem.classList.add(TEXTITEM_CLASS.marked);
}

export function makeHovered(textitem: WordElement) {
  textitem.classList.add(TEXTITEM_CLASS.hovered);
}

export function clearHovered(textitem: WordElement) {
  textitem.classList.remove(TEXTITEM_CLASS.hovered);
}

export function clearAllHovered() {
  removeAllContainingClass(TEXTITEM_CLASS.hovered);
}

export function makeMultiterm(textitems: TextitemElement[]) {
  addClassToElements(textitems, TEXTITEM_CLASS.multi);
}

export function isMarked(textitem: TextitemElement) {
  return textitem.classList.contains(TEXTITEM_CLASS.marked);
}

export function isTextitem(element: HTMLElement) {
  return element.classList.contains(TEXTITEM_CLASS.textitem);
}

export function makeFlashing(textitems: TextitemElement[]) {
  addClassToElements(textitems, TEXTITEM_CLASS.flashing);
}

export function clearAllFlashing() {
  removeAllContainingClassWithTimeout(TEXTITEM_CLASS.flashing);
}

export function makeBookmarked(
  textitems: TextitemElement[] | NodeListOf<HTMLElement>
) {
  addClassToElements(textitems, TEXTITEM_CLASS.bookmarked);
}

export function clearBookmarked(
  textitems: TextitemElement[] | NodeListOf<HTMLElement>
) {
  textitems.forEach((t) => t.classList.remove(TEXTITEM_CLASS.bookmarked));
}

export function getSentence(id: number) {
  return Array.from(
    document.querySelectorAll<TextitemElement>(
      `[data-${TEXTITEM_DATASET.sentenceId}="${id}"]`
    )
  );
}

export function makeGhosted(
  textitems: TextitemElement[] | NodeListOf<HTMLElement>
) {
  return addClassToElements(textitems, TEXTITEM_CLASS.ghosted);
}

export function clearGhosted(
  textitems: TextitemElement[] | NodeListOf<HTMLElement>
) {
  textitems.forEach((t) => t.classList.remove(TEXTITEM_CLASS.ghosted));
}
