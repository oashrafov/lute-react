import { createContext, useReducer } from "react";
import { getFromLocalStorage } from "@actions/utils";
import { DEFAULT_TEXT_SETTINGS } from "@resources/constants";

const PageContext = createContext();

function reducer(state, action) {
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

function PageContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
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
  });

  return (
    <PageContext.Provider value={{ state, dispatch }}>
      {children}
    </PageContext.Provider>
  );
}

export { PageContextProvider, PageContext };
