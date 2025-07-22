import { useContext } from "react";
import { ActiveTermContext } from "@book/store/activeTermContext";

export function useActiveTermContext() {
  return useContext(ActiveTermContext);
}
