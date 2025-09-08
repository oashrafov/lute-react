import { TEXTITEM_DATA } from "../resources/constants";
import type { TextItemElement } from "../resources/types";
import { clearAllFlashing, getMatchedTextItems, makeFlashing } from "./text";

export function handleBookmarkSentence(textitem: TextItemElement) {
  const sentenceId = textitem.dataset.sentenceId;
  const matched = getMatchedTextItems(textitem, "sentence");
  makeFlashing(matched);
  clearAllFlashing();

  // all_bookmarks = {
  //   book_id: {
  //     page_num: [{ sentence_id: 0, bookmark_description: "" }],
  //   },
  // };
  console.log(`POST sentence id: ${sentenceId} to db`);
}

export function handleShowBookmark(sentenceId: number) {
  const textitem = document.querySelector<TextItemElement>(
    `[data-${TEXTITEM_DATA.sentenceId}="${sentenceId}"][data-${TEXTITEM_DATA.sentenceStart}="true"]`
  );

  if (textitem) {
    textitem.scrollIntoView({ behavior: "smooth" });
    const matched = getMatchedTextItems(textitem, "sentence");
    setTimeout(() => makeFlashing(matched), 300);
    clearAllFlashing();
  }
}
