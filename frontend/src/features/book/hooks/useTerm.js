import { useQuery } from "@tanstack/react-query";
import { getTermQuery } from "@term/api/query";
import { useActiveTermContext } from "./useActiveTermContext";

export function useTerm() {
  const { activeTerm } = useActiveTermContext();

  const key =
    activeTerm &&
    activeTerm.type !== "shift" &&
    (activeTerm.type === "multi"
      ? `${activeTerm.data}/${activeTerm.langID}`
      : activeTerm.data);

  return useQuery(getTermQuery(key));
}
