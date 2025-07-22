import { createContext, useReducer } from "react";

const audio = new Audio();

const PlayerContext = createContext();

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

function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PlayerContext.Provider value={{ state, dispatch, audio }}>
      {children}
    </PlayerContext.Provider>
  );
}

export { PlayerProvider, PlayerContext };
