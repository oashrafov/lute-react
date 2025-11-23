import {
  keepPreviousData,
  queryOptions,
  skipToken,
} from "@tanstack/react-query";
import { api } from "./api";
import type { TermQueryParams } from "./types";

export const queries = {
  all: () => ["terms"],
  allDetails: () => [...queries.all(), "detail"],
  allTags: () => [...queries.all(), "tags"],
  allSuggestions: () => [...queries.all(), "suggestions"],
  list: (filters?: string) =>
    queryOptions({
      queryKey: [...queries.all(), filters],
      queryFn: () => api.getAll(filters),
      placeholderData: keepPreviousData,
    }),
  detail: ({ id, text, langId }: TermQueryParams) =>
    queryOptions({
      queryKey: [...queries.allDetails(), id, text, langId],
      queryFn: id
        ? () => api.getById(id)
        : text && langId
          ? () => api.getByText(text, langId)
          : skipToken,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    }),
  popup: (id: number) =>
    queryOptions({
      queryKey: [...queries.all(), "popup", id],
      queryFn: () => api.getPopup(id),
    }),
  sentences: (termText: string, langId?: number) =>
    queryOptions({
      queryKey: [...queries.all(), "sentences", langId, termText],
      queryFn:
        langId != undefined
          ? () => api.getSentences(termText, langId)
          : skipToken,
    }),
  tags: () =>
    queryOptions({
      queryKey: [...queries.allTags()],
      queryFn: api.getTags,
    }),
  termSuggestions: (searchText: string, langId?: number) =>
    queryOptions({
      queryKey: [...queries.allSuggestions(), langId, searchText],
      queryFn:
        searchText !== "" && langId != undefined
          ? () => api.getSuggestions(searchText, langId)
          : skipToken,
    }),
  tagSuggestions: () =>
    queryOptions({
      queryKey: [...queries.allTags(), "suggestions"],
      queryFn: api.getTagSuggestions,
    }),
} as const;
