import { useContext } from "react";
import { ActiveDictTabContext } from "@book/store/activeDictTabContext";

export function useActiveDictTabContext() {
  return useContext(ActiveDictTabContext);
}
