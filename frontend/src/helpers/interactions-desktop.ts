import type { MouseEvent } from "react";
import {
  clearAllHovered,
  clearAllMarked,
  clearAllMultiterm,
  clearHovered,
  clearMarked,
  getMarked,
  getTextitems,
  getTextContent,
  getWords,
  makeHovered,
  makeMarked,
  makeMultiterm,
  isMarked,
  getSentence,
  makeGhosted,
  clearGhosted,
  isTextitem,
} from "./text";
import type { ActiveTerm } from "../features/term/store/activeTermContext";
import type { TextitemElement, WordElement } from "../resources/types";

let selectionStart: WordElement | null = null;
let selectionStartShiftHeld = false;
let currentTermDataOrder = -1;

export function startHoverMode() {
  clearAllMarked();

  const currentWord = getWords().filter(
    (word) => Number(word.dataset.order) === currentTermDataOrder
  );

  if (currentWord.length === 1) {
    makeHovered(currentWord[0]);
  }

  clearAllMultiterm();
  selectionStart = null;
}
// selection started
export function handleMouseDown(e: MouseEvent) {
  if (e.button !== 0) return;

  clearAllMultiterm();
  const textitem = e.target as WordElement;
  makeMultiterm([textitem]);

  selectionStart = textitem;
  selectionStartShiftHeld = e.shiftKey;
  currentTermDataOrder = Number(textitem.dataset.order);
}
// mouse over during selection or without it
export function handleMouseOver(e: MouseEvent) {
  const textitem = e.target as WordElement;
  if (selectionStart) {
    clearAllMultiterm();
    makeMultiterm(_getSelectedInRange(selectionStart, textitem));
  } else {
    clearAllHovered();
    if (getMarked().length === 0) {
      makeHovered(textitem);
      currentTermDataOrder = Number(textitem.dataset.order);
    }
  }
}
// selection ended
export function handleMouseUp(e: MouseEvent<WordElement>): ActiveTerm {
  const textitem = e.currentTarget;
  if (selectionStart?.getAttribute("id") === textitem.getAttribute("id")) {
    return _singleWordClicked(e);
  }

  clearAllMarked();

  const selected = _getSelectedInRange(selectionStart!, textitem);
  // return selected text for copy
  if (selectionStartShiftHeld) {
    const text = getTextContent(selected);
    startHoverMode();

    return { data: text, type: "copy" };
  }

  selectionStart = null;
  selectionStartShiftHeld = false;

  const selectedMultiTerm = _getSelectedMultiTerm(selected);
  return {
    data: selectedMultiTerm.text,
    langId: selectedMultiTerm.langId,
    type: "multi",
    textitems: selected,
  };
}

export function hoverOut() {
  clearAllHovered();
}

export function hasClickedOutsideText(e: MouseEvent) {
  const target = e.target;
  if (target instanceof HTMLElement) {
    if (!isTextitem(target) && e.button === 0) {
      return true;
    }
  }
  return false;
}

export function focusActiveSentence(textitems: TextitemElement[]) {
  // make all textitems ghosted, then remove it from active sentence
  makeGhosted(getTextitems());

  const first = Number(textitems[0].dataset.sentenceId);
  const last = Number(textitems.at(-1)?.dataset.sentenceId);

  Array.from({ length: last - first + 1 }, (_, index) => first + index).forEach(
    (id) => clearGhosted(getSentence(id))
  );
}

export function resetFocusActiveSentence() {
  clearGhosted(getTextitems());
}

/** Move to the next/prev candidate determined by the selector.
 * direction is 1 if moving "right", -1 if moving "left" -
 * note that these switch depending on if the language is right-to-left! */
export function handleMoveCursor(selector: string, direction = 1) {
  const firstElement = _firstSelectedElement();
  const firstElementOrder =
    firstElement != null ? Number(firstElement.dataset.order) : 0;
  let candidates = Array.from(document.querySelectorAll<WordElement>(selector));
  let comparator = function (a: number, b: number) {
    return a > b;
  };

  if (direction < 0) {
    candidates = candidates.reverse();
    comparator = function (a, b) {
      return a < b;
    };
  }

  const match = candidates.find((el) =>
    comparator(Number(el.dataset.order), firstElementOrder)
  );

  if (match) {
    _updateCursor(match);
    // Highlight the word if we're jumping around a lot.
    if (selector !== ".word") {
      const matchOrder = Number(match.dataset.order);
      const matchClass = `highlight_${matchOrder}`;
      match.classList.add("flash-highlight", `${matchClass}`);
      setTimeout(
        () =>
          document
            .querySelector(`.${matchClass}`)
            ?.classList.remove("flash-highlight", `${matchClass}`),
        1000
      );
    }
  }
}

function _singleWordClicked(e: MouseEvent): ActiveTerm {
  clearAllMultiterm();
  selectionStart = null;
  const textitem = e.target as TextitemElement;

  clearHovered(textitem);
  currentTermDataOrder = Number(textitem.dataset.order);

  // If already clicked, remove the click marker.
  if (isMarked(textitem)) {
    clearMarked(textitem);

    if (getMarked().length === 0) {
      makeHovered(textitem);
      startHoverMode();
    }
    // selecting same word. sending null data for form to close
    return { data: null };
  }

  makeMarked(textitem);

  // Normal click without Shift
  if (!e.shiftKey) {
    clearAllMarked();
    makeMarked(textitem);

    return {
      data: Number(textitem.dataset.wordId),
      type: "single",
      textitems: [textitem],
    };
  } else {
    // shift clicking multiple words
    const markedTextitems = getMarked();
    if (markedTextitems.length > 0) {
      return {
        data: markedTextitems.map((item) => Number(item.dataset.wordId)),
        type: "select",
        textitems: markedTextitems,
      };
    }
  }

  // Shift click. returns null so term form doesn't do anything
  return null;
}
/** Update cursor, clear prior cursors. */
function _updateCursor(textitem: WordElement) {
  document
    .querySelectorAll("span.newmultiterm, span.kwordmarked, span.wordhover")
    .forEach((item) => {
      item.classList.remove("newmultiterm", "kwordmarked", "wordhover");
    });
  // for highlights in no highlights mode
  makeHovered(textitem);

  makeMarked(textitem);
  // ! NEED? to save current term data order
  // const currentTermDataOrder = parseInt(target.dataset.order);
}

/** First selected/hovered element, or null if nothing. */
function _firstSelectedElement() {
  const elements = Array.from(
    document.querySelectorAll<TextitemElement>(
      ".kwordmarked, .newmultiterm, .wordhover"
    )
  ).sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));

  return elements.length > 0 ? elements[0] : null;
}

function _getSelectedMultiTerm(selected: TextitemElement[]) {
  const textParts = selected.map((el) => el.dataset.text);
  const cleanText = textParts.join("").trim();
  const text = cleanText.replace(/\//g, "LUTESLASH");
  const langId = Number(selected[0].dataset.langId);

  return { text, langId };
}

function _getSelectedInRange(startEl: WordElement, endEl: WordElement) {
  const [startord, endord] = [
    Number(startEl.dataset.order),
    Number(endEl.dataset.order),
  ].sort((a, b) => a - b);

  const selected = getTextitems().filter((textitem) => {
    const ord = Number(textitem.dataset.order);
    return ord >= startord && ord <= endord;
  });

  return selected;
}
