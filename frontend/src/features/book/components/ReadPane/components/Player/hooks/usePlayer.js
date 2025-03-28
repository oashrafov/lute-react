import { useEffect, useReducer } from "react";

function usePlayer(book, audio) {
  const [state, dispatch] = useReducer(reducer, initialState);

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
  }, [audio, book.audio.bookmarks, book.audio.position, book.id]);

  return [state, dispatch];
}

function reducer(state, action) {
  switch (action.type) {
    case "statusToggled":
      return { ...state, playing: !state.playing };
    case "volumeChanged":
      return { ...state, volume: action.payload };
    case "rateChanged":
      return { ...state, rate: action.payload };
    case "timeChanged":
      return { ...state, time: action.payload };
    case "durationSet":
      return { ...state, duration: action.payload };
    case "bookmarkSaved":
      return {
        ...state,
        bookmarks: [...state.bookmarks, { value: action.payload }].toSorted(
          function (a, b) {
            return a.value - b.value;
          }
        ),
      };
    case "bookmarkRemoved":
      return {
        ...state,
        bookmarks: state.bookmarks.filter(
          (mark) => mark.value !== action.payload
        ),
      };
    case "bookmarkActive":
      return {
        ...state,
        bookmarkActive: action.payload,
      };
    case "skipAmount":
      return {
        ...state,
        skipAmount: action.payload,
      };
    case "controlsReset":
      return { ...state, rate: 1, volume: 1, playing: false };
    default:
      throw new Error();
  }
}

const initialState = {
  playing: false,
  volume: 1,
  rate: 1,
  time: 0,
  duration: 0,
  bookmarks: [],
  bookmarkActive: false,
  skipAmount: "5",
};

export { usePlayer };
