import { useQuery } from "@tanstack/react-query";
import { queries } from "../api/queries";

export function useUserLanguageQuery(id: number) {
  return useQuery(queries.userLanguageDetail(id));
}
