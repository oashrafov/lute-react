import { useEffect } from "react";
import { usePlayerContext } from "./usePlayerContext";

export function useHighlightActiveBookmark() {
  const { state, dispatch, audio } = usePlayerContext();

  useEffect(() => {
    function highlightActiveBookmark() {
      const rounded = parseFloat(audio.currentTime.toFixed(1));
      state.bookmarks.forEach((bookmark) =>
        dispatch({ type: "bookmarkActive", payload: bookmark === rounded })
      );
    }

    audio.addEventListener("timeupdate", highlightActiveBookmark);
    return () =>
      audio.removeEventListener("timeupdate", highlightActiveBookmark);
  }, [state.bookmarks, dispatch, audio]);
}
