import { useContext } from "react";
import { ActiveDictTabContext } from "../store/activeDictTabContext";

export function useActiveDictTabContext() {
  const context = useContext(ActiveDictTabContext);

  if (!context) {
    throw new Error("Can't use outside of context");
  }

  return context;
}
