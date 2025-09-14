import { isLightColor } from "@mantine/core";
import type {
  GeneralHighlights,
  StatusHighlights,
} from "../features/settings/api/types";
import { TEXTITEM_DATA } from "../resources/constants";
import type { TextItemElement } from "../resources/types";

export function applyLuteHighlights(
  highlights: GeneralHighlights | StatusHighlights,
  scheme: "dark" | "light"
) {
  const root = document.querySelector<HTMLElement>(
    `:root[data-mantine-color-scheme="${scheme}"]`
  )!;

  Object.keys(highlights).forEach((value) => {
    const highlight = highlights[value][scheme];
    const highlightType = highlights[value].type;

    root.style.setProperty(`--lute-color-highlight-${value}`, highlight);
    setTextColor(value, highlight, root);

    if (highlightType) {
      document
        .querySelectorAll<TextItemElement>(
          `[data-${TEXTITEM_DATA.status}="${value}"]`
        )
        .forEach(
          (textitem) => (textitem.dataset.highlightType = highlightType)
        );
    }
  });
}

export function setTextColor(id: string, color: string, root: HTMLElement) {
  root.style.setProperty(
    `--lute-text-color-${id}`,
    isLightColor(color)
      ? "var(--mantine-color-dark-7)"
      : "var(--mantine-color-dark-0)"
  );
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
