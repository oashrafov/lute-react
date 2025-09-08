import { useQuery } from "@tanstack/react-query";
import { queries } from "../api/queries";
import { useActiveTermContext } from "./useActiveTermContext";
import type { TermQueryParams } from "../api/types";

export function useTermQuery() {
  const { activeTerm } = useActiveTermContext();

  const params: TermQueryParams = {};

  if (activeTerm) {
    if (activeTerm.type === "single") {
      params.id = activeTerm.data;
    }
    if (activeTerm.type === "multi") {
      params.text = activeTerm.data;
      params.langId = activeTerm.langId;
    }
  }

  return useQuery(queries.detail(params));
}
