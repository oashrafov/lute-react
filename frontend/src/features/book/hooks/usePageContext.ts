import { useContext } from "react";
import { PageContext } from "../store/pageContext";

export function usePageContext() {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error("Can't use outside of context");
  }

  return context;
}
