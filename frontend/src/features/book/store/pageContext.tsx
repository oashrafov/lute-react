import {
  createContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { getFromLocalStorage } from "../../../utils/utils";
import { DEFAULT_TEXT_SETTINGS } from "../../../resources/constants";

interface PageSettings {
  fontSize: number;
  lineHeight: number;
  columnCount: number;
  highlights: boolean;
  textWidth: number;
}

interface SetHighlightsAction {
  type: "setHighlights";
  payload: boolean;
}

interface ToggleHighlightsAction {
  type: "toggleHighlights";
}

interface SetColumnCountAction {
  type: "setColumnCount";
  payload: number;
}
interface SetLineHeightAction {
  type: "setLineHeight";
  payload: number;
}

interface SetFontSizeAction {
  type: "setFontSize";
  payload: number;
}

interface SetTextWidthAction {
  type: "setTextWidth";
  payload: number;
}

export type PageAction =
  | SetHighlightsAction
  | ToggleHighlightsAction
  | SetColumnCountAction
  | SetLineHeightAction
  | SetFontSizeAction
  | SetTextWidthAction;

interface PageContextValue {
  state: PageSettings;
  dispatch: Dispatch<PageAction>;
}

const PageSettings = createContext<PageContextValue | null>(null);

function reducer(state: PageSettings, action: PageAction): PageSettings {
  switch (action.type) {
    case "setHighlights":
      return { ...state, highlights: action.payload };
    case "toggleHighlights":
      return { ...state, highlights: !state.highlights };
    case "setColumnCount":
      return { ...state, columnCount: action.payload };
    case "setLineHeight":
      return { ...state, lineHeight: action.payload };
    case "setFontSize":
      return { ...state, fontSize: action.payload };
    case "setTextWidth":
      return { ...state, textWidth: action.payload };
    default:
      throw new Error();
  }
}

function PageContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    fontSize: getFromLocalStorage(
      "Lute.fontSize",
      DEFAULT_TEXT_SETTINGS.fontSize
    ),
    lineHeight: getFromLocalStorage(
      "Lute.lineHeight",
      DEFAULT_TEXT_SETTINGS.lineHeight
    ),
    columnCount: getFromLocalStorage(
      "Lute.columnCount",
      DEFAULT_TEXT_SETTINGS.columnCount
    ),
    highlights: getFromLocalStorage(
      "Lute.highlights",
      DEFAULT_TEXT_SETTINGS.highlights
    ),
    textWidth: getFromLocalStorage(
      "Lute.textWidth",
      DEFAULT_TEXT_SETTINGS.textWidth
    ),
  }));

  return (
    <PageSettings.Provider value={{ state, dispatch }}>
      {children}
    </PageSettings.Provider>
  );
}

export { PageContextProvider, PageSettings as PageContext };
