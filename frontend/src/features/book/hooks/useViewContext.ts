import { useContext } from "react";
import { ViewContext } from "../store/viewContext";

export function useViewContext() {
  const context = useContext(ViewContext);

  if (!context) {
    throw new Error("Can't use outside of context");
  }

  return context;
}
