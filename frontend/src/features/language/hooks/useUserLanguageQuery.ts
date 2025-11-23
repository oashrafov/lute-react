import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { query } from "#language/api/query";

export function useUserLanguageQuery() {
  const { langId } = useSearch({ strict: false });
  return useQuery(query.userLanguageDetail(langId));
}
