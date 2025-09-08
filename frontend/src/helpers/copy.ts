import type { TextItemElement, TextUnit } from "../resources/types";
import { copyToClipboard } from "../utils/utils";
import {
  clearAllFlashing,
  getMatchedTextItems,
  getTextitems,
  getTextContent,
  makeFlashing,
} from "./text";

export async function handleCopy(textitem: TextItemElement, unit?: TextUnit) {
  const { text, textitems } = await _copyUnit(textitem, unit);
  makeFlashing(textitems);
  clearAllFlashing();

  return text;
}

async function _copyUnit(textitem: TextItemElement, unit?: TextUnit) {
  const textitems =
    unit === "page" ? getTextitems() : getMatchedTextItems(textitem, unit);

  const text = getTextContent(textitems);
  await copyToClipboard(text);

  return { text, textitems };
}
