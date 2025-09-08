import type { Dispatch } from "react";
import { clamp, getFromLocalStorage } from "../utils/utils";
import type { View } from "../features/book/store/viewContext";
import type { PageAction } from "../features/book/store/pageContext";

export function handleSetHighlights(
  checked: boolean,
  dispatch: Dispatch<PageAction>
) {
  dispatch({ type: "setHighlights", payload: checked });
  localStorage.setItem("Lute.highlights", JSON.stringify(checked));
}

export function handleToggleHighlights(dispatch: Dispatch<PageAction>) {
  dispatch({ type: "toggleHighlights" });
  const state = getFromLocalStorage("Lute.highlights", false);
  localStorage.setItem("Lute.highlights", JSON.stringify(!state));
}

export function handleSetView(view: View) {
  localStorage.setItem("Lute.view", JSON.stringify(view));
}

export function handleSetColumnCount(
  count: number,
  dispatch: Dispatch<PageAction>
) {
  dispatch({ type: "setColumnCount", payload: count });
  localStorage.setItem("Lute.columnCount", JSON.stringify(count));
}

export function handleSetLineHeight(
  amount: number,
  dispatch: Dispatch<PageAction>
) {
  const clamped = clamp(amount, 0, 15);
  dispatch({ type: "setLineHeight", payload: clamped });
  localStorage.setItem("Lute.lineHeight", JSON.stringify(clamped));
}

export function handleSetFontSize(
  size: number,
  dispatch: Dispatch<PageAction>
) {
  const rounded = Number(size.toFixed(2));
  const clamped = clamp(rounded, 0.5, 3);
  dispatch({ type: "setFontSize", payload: clamped });
  localStorage.setItem("Lute.fontSize", JSON.stringify(clamped));
}

export function handleSetTextWidth(
  width: number,
  dispatch: Dispatch<PageAction>
) {
  const rounded = Number(width.toFixed(3));
  const clamped = clamp(rounded, 30, 100);
  dispatch({ type: "setTextWidth", payload: clamped });
  localStorage.setItem("Lute.textWidth", JSON.stringify(clamped));
}
