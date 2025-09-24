import { TEXTITEM_DATASET } from "../resources/constants";
import type { TextitemElement } from "../resources/types";
import { clearAllFlashing, getMatchedTextitems, makeFlashing } from "./text";

export function handleBookmarkSentence(textitem: TextitemElement) {
  const sentenceId = textitem.dataset.sentenceId;
  const matched = getMatchedTextitems(textitem, "sentence");
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
  const textitem = document.querySelector<TextitemElement>(
    `[data-${TEXTITEM_DATASET.sentenceId}="${sentenceId}"][data-${TEXTITEM_DATASET.sentenceStart}="true"]`
  );

  if (textitem) {
    textitem.scrollIntoView({ behavior: "smooth" });
    const matched = getMatchedTextitems(textitem, "sentence");
    setTimeout(() => makeFlashing(matched), 300);
    clearAllFlashing();
  }
}
