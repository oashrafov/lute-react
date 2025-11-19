import type { TextitemElement, TextUnit } from "#resources/types";
import { copyToClipboard } from "#utils/utils";
import {
  clearAllFlashing,
  getMatchedTextitems,
  getTextitems,
  getTextContent,
  makeFlashing,
} from "./text";

export async function handleCopy(textitem: TextitemElement, unit?: TextUnit) {
  const { text, textitems } = await _copyUnit(textitem, unit);
  makeFlashing(textitems);
  clearAllFlashing();

  return { text, textitems };
}

async function _copyUnit(textitem: TextitemElement, unit?: TextUnit) {
  const textitems =
    unit === "page" ? getTextitems() : getMatchedTextitems(textitem, unit);

  const text = getTextContent(textitems);
  await copyToClipboard(text);

  return { text, textitems };
}
