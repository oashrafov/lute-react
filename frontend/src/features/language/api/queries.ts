import { queryOptions, skipToken } from "@tanstack/react-query";
import { api } from "./api";

export const queries = {
  all: () => ["languages"],
  allUser: () => [...queries.all(), "user"],
  allPredefined: () => [...queries.all(), "predefined"],
  allUserLangDetails: () => [...queries.allUser(), "detail"],
  allPredefinedLangDetails: () => [...queries.allPredefined(), "detail"],
  userLanguagesList: () =>
    queryOptions({
      queryKey: [...queries.allUser()],
      queryFn: api.getUserLanguages,
    }),
  predefinedLanguagesList: () =>
    queryOptions({
      queryKey: [...queries.allPredefined()],
      queryFn: api.getPredefinedLanguages,
      staleTime: Infinity,
    }),
  parsers: () =>
    queryOptions({
      queryKey: [...queries.all(), "parsers"],
      queryFn: api.getParsers,
      staleTime: Infinity,
    }),
  userLanguageDetail: (id?: number) =>
    queryOptions({
      queryKey: [...queries.allUserLangDetails(), id],
      queryFn:
        id != null && id !== 0 ? () => api.getUserLanguage(id) : skipToken,
      refetchOnWindowFocus: false,
    }),
  predefinedLanguageDetail: (name?: string) =>
    queryOptions({
      queryKey: [...queries.allPredefinedLangDetails(), name],
      queryFn: name ? () => api.getPredefinedLanguage(name) : skipToken,
      staleTime: Infinity,
    }),
  languageForm: () =>
    queryOptions({
      queryKey: ["languageForm"],
      queryFn: api.getFormValues,
    }),
} as const;
