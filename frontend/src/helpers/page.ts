import {
  clamp,
  getFromLocalStorage,
  setLocalStorageItem,
} from "../utils/utils";
import { getTextContainer, setTextSetting } from "./general";
import type { View } from "../features/book/store/viewContext";
import type { LocalStorageItem } from "../resources/types";

export function handleSetHighlights(checked: boolean) {
  setLocalStorageItem<LocalStorageItem>("Lute.highlights", checked);
  const textContainer = getTextContainer()!;
  textContainer.dataset.showHighlights = checked ? "true" : "false";
}

export function handleToggleHighlights() {
  const state = getFromLocalStorage<LocalStorageItem>("Lute.highlights", false);
  setLocalStorageItem<LocalStorageItem>("Lute.highlights", !state);
  getTextContainer()!.dataset.showHighlights = state ? "false" : "true";
  const switchInput = document.getElementById(
    "highlightsSwitch"
  ) as HTMLInputElement;
  switchInput.checked = !switchInput.checked;
}

export function handleSetView(view: View) {
  setLocalStorageItem<LocalStorageItem>("Lute.view", view);
}

export function handleSetColumnCount(count: number) {
  setLocalStorageItem<LocalStorageItem>("Lute.columnCount", count);
  setTextSetting("columnCount", String(count));
}

export function handleSetLineHeight(amount: number) {
  const clamped = clamp(amount, 0, 15);
  setLocalStorageItem<LocalStorageItem>("Lute.lineHeight", clamped);
  setTextSetting("lineHeight", `${clamped}px`);
}

export function handleSetFontSize(size: number) {
  const clamped = clamp(Number(size.toFixed(2)), 0.5, 3);
  setLocalStorageItem<LocalStorageItem>("Lute.fontSize", clamped);
  setTextSetting("fontSize", `${clamped}rem`);
}

export function handleSetTextWidth(width: number) {
  const clamped = clamp(Number(width.toFixed(3)), 30, 100);
  setLocalStorageItem<LocalStorageItem>("Lute.textWidth", clamped);
  setTextSetting("textWidth", `${clamped}%`);
}
