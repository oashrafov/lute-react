import type { FocusEvent, KeyboardEvent } from "react";

export function getFromLocalStorage<T>(item: string, defaultVal: T) {
  const storageVal = JSON.parse(localStorage.getItem(item)!);

  if (storageVal === null || Object.is(storageVal, NaN)) {
    return defaultVal;
  } else {
    return storageVal;
  }
}

export const paneResizeStorage = (() => {
  function strip(name: string) {
    return name.replace("react-resizable-panels:", "");
  }

  return {
    getItem(name: string) {
      return JSON.parse(localStorage.getItem(strip(name))!);
    },
    setItem(name: string, value: string) {
      localStorage.setItem(strip(name), JSON.stringify(value));
    },
  };
})();

export function convertPixelsToRem(sizeInPixels: number) {
  const bodyFontSize = window.getComputedStyle(
    document.querySelector("body")!
  ).fontSize;

  return sizeInPixels / parseFloat(bodyFontSize);
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Get the pressed keys as a string, eg 'meta-c', 'shift-a'.
 *
 * Note that there _must_ be a "regular" key pressed as well.
 * If only meta/alt/ctl/shift are pressed, returns null.
 */
export function getPressedKeysAsString(event: KeyboardEvent<HTMLInputElement>) {
  const keys = [];

  // Check for modifier keys
  if (event.ctrlKey) keys.push("ctrl");
  if (event.shiftKey) keys.push("shift");
  if (event.altKey) keys.push("alt");
  if (event.metaKey) keys.push("meta");

  const code = event.key;
  // console.log(`event.code = ${code}`);
  // console.log('event = ', event)
  keys.push(code);
  const ret = keys.join("+");
  // console.log(`got hotkey = ${ret}`);
  return ret;
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
    .forEach((element) => element.classList.remove(`${className}`));
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
