import { useEffect } from "react";
import { usePlayerContext } from "./usePlayerContext";

export function useHighlightActiveBookmark() {
  const { state, dispatch, audio } = usePlayerContext();

  useEffect(() => {
    function highlightActiveBookmark() {
      const rounded = parseFloat(audio.currentTime.toFixed(1));
      state.bookmarks.map((bookmark) => {
        if (bookmark === rounded) {
          dispatch({ type: "bookmarkActive", payload: true });
        } else {
          dispatch({ type: "bookmarkActive", payload: false });
        }
      });
    }

    audio.addEventListener("timeupdate", highlightActiveBookmark);
    return () =>
      audio.removeEventListener("timeupdate", highlightActiveBookmark);
  }, [state.bookmarks, dispatch, audio]);
}
