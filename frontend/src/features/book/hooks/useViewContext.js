import { useContext } from "react";
import { ViewContext } from "@book/store/ViewContext";

export function useViewContext() {
  return useContext(ViewContext);
}
