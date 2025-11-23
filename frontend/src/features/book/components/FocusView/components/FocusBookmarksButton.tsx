import type { PageBookmark } from "#book/api/types";
import { BookmarksButton } from "#book/components/common/BookmarksButton";
import { BookmarksMenu } from "#book/components/common/BookmarksMenu";

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
