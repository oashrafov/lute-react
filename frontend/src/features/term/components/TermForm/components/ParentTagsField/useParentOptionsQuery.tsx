import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { buildSuggestionsList } from "#helpers/term";
import { MAX_TERM_SUGGESTIONS } from "#resources/constants.ts";
import { query } from "#term/api/query";

export function useParentOptionsQuery(
  search: string,
  termText: string,
  existingParents: string[]
) {
  const { langId } = useSearch({ strict: false });
  const { data, isFetching } = useQuery(query.termSuggestions(search, langId));
  const suggestions = data
    ? buildSuggestionsList(data.filter((d) => d.text !== termText))
    : [];

  return {
    data: suggestions
      .slice(0, MAX_TERM_SUGGESTIONS)
      .filter((item) =>
        item.suggestion.toLowerCase().includes(search.trim().toLowerCase())
      )
      .filter((item) => !existingParents.includes(item.value))
      .map((item) => JSON.stringify({ ...item, option: item.suggestion })),
    isFetching,
  };
}
