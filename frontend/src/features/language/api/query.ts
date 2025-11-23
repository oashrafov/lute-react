import { queryOptions, skipToken } from "@tanstack/react-query";
import { api } from "./api";

export const query = {
  all: () => ["languages"],
  allUser: () => [...query.all(), "user"],
  allPredefined: () => [...query.all(), "predefined"],
  allUserLangDetails: () => [...query.allUser(), "detail"],
  allPredefinedLangDetails: () => [...query.allPredefined(), "detail"],
  userLanguagesList: () =>
    queryOptions({
      queryKey: [...query.allUser()],
      queryFn: api.getUserLanguages,
    }),
  predefinedLanguagesList: () =>
    queryOptions({
      queryKey: [...query.allPredefined()],
      queryFn: api.getPredefinedLanguages,
      staleTime: Infinity,
    }),
  parsers: () =>
    queryOptions({
      queryKey: [...query.all(), "parsers"],
      queryFn: api.getParsers,
      staleTime: Infinity,
    }),
  userLanguageDetail: (id?: number) =>
    queryOptions({
      queryKey: [...query.allUserLangDetails(), id],
      queryFn:
        id != null && id !== 0 ? () => api.getUserLanguage(id) : skipToken,
      refetchOnWindowFocus: false,
    }),
  predefinedLanguageDetail: (name?: string) =>
    queryOptions({
      queryKey: [...query.allPredefinedLangDetails(), name],
      queryFn: name ? () => api.getPredefinedLanguage(name) : skipToken,
      staleTime: Infinity,
    }),
  languageForm: () =>
    queryOptions({
      queryKey: ["languageForm"],
      queryFn: api.getFormValues,
    }),
} as const;
