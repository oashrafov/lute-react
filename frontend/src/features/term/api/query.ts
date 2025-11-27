import {
  keepPreviousData,
  queryOptions,
  skipToken,
} from "@tanstack/react-query";
import { api } from "./api";
import type { TermQueryParams } from "./types";

export const query = {
  all: () => ["terms"],
  allDetails: () => [...query.all(), "detail"],
  allTags: () => [...query.all(), "tags"],
  allSuggestions: () => [...query.all(), "suggestions"],
  list: (filters?: string) =>
    queryOptions({
      queryKey: [...query.all(), filters],
      queryFn: () => api.getAll(filters),
      placeholderData: keepPreviousData,
    }),
  detail: (data: TermQueryParams | undefined) =>
    queryOptions({
      queryKey: [...query.allDetails(), ...Object.values(data ?? {})],
      queryFn: () => {
        if (!data) return skipToken;

        if ("id" in data) {
          return () => api.getById(data.id);
        } else {
          return () => api.getByText(data.text, data.langId);
        }
      },
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    }),
  popup: (id: number) =>
    queryOptions({
      queryKey: [...query.all(), "popup", id],
      queryFn: () => api.getPopup(id),
    }),
  sentences: (termText: string, langId?: number) =>
    queryOptions({
      queryKey: [...query.all(), "sentences", langId, termText],
      queryFn:
        langId != undefined
          ? () => api.getSentences(termText, langId)
          : skipToken,
    }),
  tags: () =>
    queryOptions({
      queryKey: [...query.allTags()],
      queryFn: api.getTags,
    }),
  termSuggestions: (searchText: string, langId?: number) =>
    queryOptions({
      queryKey: [...query.allSuggestions(), langId, searchText],
      queryFn:
        searchText !== "" && langId != undefined
          ? () => api.getSuggestions(searchText, langId)
          : skipToken,
    }),
  tagSuggestions: () =>
    queryOptions({
      queryKey: [...query.allTags(), "suggestions"],
      queryFn: api.getTagSuggestions,
    }),
} as const;
