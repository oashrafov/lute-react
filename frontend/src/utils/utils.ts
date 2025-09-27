import type { FocusEvent, KeyboardEvent as ReactKeyboardEvent } from "react";

export function getFromLocalStorage<K extends string>(
  item: K,
  defaultVal: unknown
) {
  const storageVal = JSON.parse(localStorage.getItem(item)!);

  if (storageVal === null || Object.is(storageVal, NaN)) {
    return defaultVal;
  } else {
    return storageVal;
  }
}

export function setLocalStorageItem<K extends string>(key: K, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function convertPixelsToRem(sizeInPixels: number) {
  const bodyFontSize = window.getComputedStyle(
    document.querySelector("body")!
  ).fontSize;

  return sizeInPixels / parseFloat(bodyFontSize);
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

// Get the pressed keys as a string, eg 'meta-KeyC', 'shift-KeyA'
export function getPressedKeysAsString(
  event: KeyboardEvent | ReactKeyboardEvent
) {
  const keys = [];

  if (event.ctrlKey) keys.push("ctrl");
  if (event.shiftKey) keys.push("shift");
  if (event.altKey) keys.push("alt");
  if (event.metaKey) keys.push("meta");

  keys.push(event.code);

  return keys.join("+");
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return text;
  } catch (error) {
    console.error("Failed to copy: ", error);
    return false;
  }
}

export function addClassToElements(
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  className: string
) {
  elements.forEach((element) => element.classList.add(className));
}

export function removeAllContainingClassWithTimeout(
  className: string,
  removeAfter = 1000
) {
  setTimeout(() => removeAllContainingClass(className), removeAfter);
}

export function removeAllContainingClass(className: string) {
  document
    .querySelectorAll(`.${className}`)
    .forEach((element) => element.classList.remove(className));
}

export function convertSecsToDisplayString(secs: number) {
  const minutes = Math.floor(secs / 60);
  const seconds = (secs % 60).toFixed(1);
  const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const s = secs % 60 < 10 ? `0${seconds}` : `${seconds}`;

  return `${m}:${s}`;
}

export function moveCursorToEnd(e: FocusEvent) {
  const input = e.target as HTMLInputElement | HTMLTextAreaElement;
  input.setSelectionRange(input.value.length, input.value.length);
}

export function getFormDataFromObj(obj: object) {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => formData.append(key, value));

  return formData;
}
