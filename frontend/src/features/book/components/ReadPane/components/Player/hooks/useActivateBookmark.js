import { useEffect } from "react";

function useActivateBookmark(audio, state, dispatch) {
  useEffect(() => {
    function timeUpdateCallback() {
      const rounded = parseFloat(audio.currentTime.toFixed(1));
      state.bookmarks.map((bookmark) => bookmark.value).includes(rounded)
        ? dispatch({ type: "bookmarkActive", payload: true })
        : dispatch({ type: "bookmarkActive", payload: false });
    }

    audio.addEventListener("timeupdate", timeUpdateCallback);

    return () => {
      audio.removeEventListener("timeupdate", timeUpdateCallback);
    };
  }, [state.bookmarks, dispatch, audio]);
}

export { useActivateBookmark };
