import { useEffect } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { usePlayerContext } from "./usePlayerContext";
import type { Audio } from "../../../../api/types";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function useInitializePlayer(audioData: Audio, source: string) {
  const { bookId } = route.useParams();
  const { dispatch, audio } = usePlayerContext();

  const bookmarksStr = JSON.stringify(audioData.bookmarks);
  type BookmarksType = typeof audioData.bookmarks;
  useEffect(() => {
    audio.src = source;
    audio.currentTime = audioData.position;
    dispatch({ type: "timeChanged", payload: audioData.position });
    (JSON.parse(bookmarksStr) as BookmarksType).forEach((bookmark) =>
      dispatch({ type: "bookmarkSaved", payload: bookmark })
    );
  }, [audio, bookmarksStr, audioData.position, bookId, dispatch, source]);
}
