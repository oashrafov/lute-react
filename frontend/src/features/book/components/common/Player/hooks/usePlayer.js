import { useEffect } from "react";
import { usePlayerContext } from "./usePlayerContext";

export function usePlayer(book) {
  const { dispatch, audio } = usePlayerContext();

  useEffect(() => {
    audio.src = `http://localhost:5001/api/books/${book.id}/audio`;

    // retrieve last position
    audio.currentTime = book.audio.position;
    dispatch({ type: "timeChanged", payload: book.audio.position });
    // retrieve bookmarks
    book.audio.bookmarks.forEach((bookmark) =>
      dispatch({ type: "bookmarkSaved", payload: bookmark })
    );

    function timeUpdateCallback() {
      dispatch({ type: "timeChanged", payload: audio.currentTime });
    }

    function loadedMetadataCallback() {
      dispatch({ type: "durationSet", payload: audio.duration });
      dispatch({ type: "controlsReset" });

      audio.rate = 1.0;
      audio.volume = 1.0;
      audio.pause();
    }

    audio.addEventListener("timeupdate", timeUpdateCallback);
    audio.addEventListener("loadedmetadata", loadedMetadataCallback);

    return () => {
      audio.removeEventListener("timeupdate", timeUpdateCallback);
      audio.removeEventListener("loadedmetadata", loadedMetadataCallback);
    };
  }, [audio, book.audio.bookmarks, book.audio.position, book.id, dispatch]);
}
