import {
  keepPreviousData,
  queryOptions,
  skipToken,
} from "@tanstack/react-query";
import {
  getSentences,
  getTags,
  getTagSuggestions,
  getTermById,
  getTermByText,
  getTermPopup,
  getTerms,
  getTermSuggestions,
} from "./api";
import type { TermQueryParams } from "./types";

export const queries = {
  all: () => ["terms"],
  allDetails: () => [...queries.all(), "detail"],
  allTags: () => [...queries.all(), "tags"],
  allSuggestions: () => [...queries.all(), "suggestions"],
  list: (filters?: string) =>
    queryOptions({
      queryKey: [...queries.all(), filters],
      queryFn: () => getTerms(filters),
      placeholderData: keepPreviousData,
      staleTime: Infinity,
    }),
  detail: ({ id, text, langId }: TermQueryParams) =>
    queryOptions({
      queryKey: [...queries.allDetails(), id, text, langId],
      queryFn: id
        ? () => getTermById(id)
        : text && langId
          ? () => getTermByText(text, langId)
          : skipToken,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    }),
  popup: (id: number) =>
    queryOptions({
      queryKey: [...queries.all(), "popup", id],
      queryFn: () => getTermPopup(id),
    }),
  sentences: (termText: string, langId: number) =>
    queryOptions({
      queryKey: [...queries.all(), "sentences", langId, termText],
      queryFn: () => getSentences(termText, langId),
      staleTime: Infinity,
    }),
  tags: () =>
    queryOptions({
      queryKey: [...queries.allTags()],
      queryFn: getTags,
    }),
  termSuggestions: (searchText: string, langId: number) =>
    queryOptions({
      queryKey: [...queries.allSuggestions(), langId, searchText],
      queryFn:
        searchText !== "" && langId != null
          ? () => getTermSuggestions(searchText, langId)
          : skipToken,
    }),
  tagSuggestions: () =>
    queryOptions({
      queryKey: [...queries.allTags(), "suggestions"],
      queryFn: getTagSuggestions,
    }),
} as const;
