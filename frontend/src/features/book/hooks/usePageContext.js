import { useContext } from "react";
import { PageContext } from "@book/store/pageContext";

export function usePageContext() {
  return useContext(PageContext);
}
