import {
  getTextItemsText,
  getMatchedTextItems,
  copyToClipboard,
  addClassToElements,
  removeAllContainingClassWithTimeout,
} from "./utils";

async function handleCopy(textitem, unit) {
  const [text, matched] = await _copyUnit(textitem, unit);
  addClassToElements(matched, "flash");
  removeAllContainingClassWithTimeout("flash");

  return text;
}

async function _copyUnit(textitem, unit) {
  let attr;
  let matched;

  if (unit === "page")
    matched = Array.from(document.querySelectorAll(".textitem"));
  else {
    switch (unit) {
      case "sentence":
        attr = "sentence-id";
        break;
      case "paragraph":
        attr = "paragraph-id";
        break;
      case "":
        attr = null;
        break;
    }
    matched = getMatchedTextItems(textitem, attr);
  }

  const text = getTextItemsText(matched);
  await copyToClipboard(text);

  return [text, matched];
}

export { handleCopy };
