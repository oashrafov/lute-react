import { isLightColor } from "@mantine/core";

export function setTextColor(id: string, color: string) {
  const root = document.documentElement;
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
