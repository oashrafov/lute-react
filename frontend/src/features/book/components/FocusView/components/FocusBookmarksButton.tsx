import type { PageBookmark } from "../../../api/types";
import { BookmarksButton } from "../../common/BookmarksButton";
import { BookmarksMenu } from "../../common/BookmarksMenu";

interface FocusBookmarksButton {
  bookmarks: PageBookmark | null;
}

export function FocusBookmarksButton({ bookmarks }: FocusBookmarksButton) {
  return bookmarks ? (
    <BookmarksMenu data={bookmarks}>
      <BookmarksButton />
    </BookmarksMenu>
  ) : (
    <BookmarksButton disabled />
  );
}
