import { useEffect } from "react";
import { usePlayerContext } from "./usePlayerContext";
import { BASE_API_URL } from "../../../../../../resources/constants";
import { useBookQuery } from "../../../../hooks/useBookQuery";

export function useInitializePlayer() {
  const { data: book } = useBookQuery();
  const { dispatch, audio } = usePlayerContext();

  const bookmarksStr = JSON.stringify(book.audio.bookmarks);
  type BookmarksType = typeof book.audio.bookmarks;
  useEffect(() => {
    audio.src = `${BASE_API_URL}/books/${book.id}/audio`;
    audio.currentTime = book.audio.position;
    dispatch({ type: "timeChanged", payload: book.audio.position });
    (JSON.parse(bookmarksStr) as BookmarksType).forEach((bookmark) =>
      dispatch({ type: "bookmarkSaved", payload: bookmark })
    );
  }, [audio, bookmarksStr, book.audio.position, book.id, dispatch]);
}
