import {
  createContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

const audio = new Audio();

interface PlayerSettings {
  isPlaying: boolean;
  volume: number;
  rate: number;
  time: number;
  duration: number;
  bookmarks: number[];
  bookmarkActive: boolean;
  skipAmount: string;
}

interface StatusToggledAction {
  type: "statusToggled";
}

interface VolumeChangedAction {
  type: "volumeChanged";
  payload: number;
}

interface RateChangedAction {
  type: "rateChanged";
  payload: number;
}

interface TimeChangedAction {
  type: "timeChanged";
  payload: number;
}

interface DurationSetAction {
  type: "durationSet";
  payload: number;
}

interface BookmarkSaved {
  type: "bookmarkSaved";
  payload: number;
}

interface BookmarkRemoved {
  type: "bookmarkRemoved";
  payload: number;
}

interface BookmarkActive {
  type: "bookmarkActive";
  payload: boolean;
}

interface SkipAmount {
  type: "skipAmount";
  payload: string;
}

interface ControlsReset {
  type: "controlsReset";
}

type Action =
  | StatusToggledAction
  | VolumeChangedAction
  | RateChangedAction
  | TimeChangedAction
  | DurationSetAction
  | BookmarkSaved
  | BookmarkRemoved
  | BookmarkActive
  | SkipAmount
  | ControlsReset;

interface PlayerContextValue {
  state: PlayerSettings;
  dispatch: Dispatch<Action>;
  audio: HTMLAudioElement;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

function reducer(state: PlayerSettings, action: Action): PlayerSettings {
  switch (action.type) {
    case "statusToggled":
      return { ...state, isPlaying: !state.isPlaying };
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
        bookmarks: [...state.bookmarks, action.payload].toSorted(
          (a, b) => a - b
        ),
      };
    case "bookmarkRemoved":
      return {
        ...state,
        bookmarks: state.bookmarks.filter(
          (bookmark) => bookmark !== action.payload
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
      return { ...state, rate: 1, volume: 1, isPlaying: false };
    default:
      throw new Error();
  }
}

const initialState: PlayerSettings = {
  isPlaying: false,
  volume: 1,
  rate: 1,
  time: 0,
  duration: 0,
  bookmarks: [],
  bookmarkActive: false,
  skipAmount: "5",
};

function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PlayerContext.Provider value={{ state, dispatch, audio }}>
      {children}
    </PlayerContext.Provider>
  );
}

export { PlayerProvider, PlayerContext };
