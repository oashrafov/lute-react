import { queryOptions } from "@tanstack/react-query";
import {
  getLanguageFormInitValues,
  getLanguageParsers,
  getPredefinedLanguage,
  getPredefinedLanguages,
  getUserLanguage,
  getUserLanguages,
} from "./api";

export const queries = {
  all: () => ["languages"],
  allUser: () => [...queries.all(), "user"],
  allPredefined: () => [...queries.all(), "predefined"],
  allUserLangDetails: () => [...queries.allUser(), "detail"],
  allPredefinedLangDetails: () => [...queries.allPredefined(), "detail"],
  userLanguagesList: () =>
    queryOptions({
      queryKey: [...queries.allUser()],
      queryFn: getUserLanguages,
    }),
  predefinedLanguagesList: () =>
    queryOptions({
      queryKey: [...queries.allPredefined()],
      queryFn: getPredefinedLanguages,
      staleTime: Infinity,
    }),
  parsers: () =>
    queryOptions({
      queryKey: [...queries.all(), "parsers"],
      queryFn: getLanguageParsers,
      staleTime: Infinity,
    }),
  userLanguageDetail: (id: number) =>
    queryOptions({
      queryKey: [...queries.allUserLangDetails(), id],
      queryFn: () => getUserLanguage(id),
      enabled: id != null && id !== 0,
      refetchOnWindowFocus: false,
    }),
  predefinedLanguageDetail: (name: string) =>
    queryOptions({
      queryKey: [...queries.allPredefinedLangDetails(), name],
      queryFn: () => getPredefinedLanguage(name),
      staleTime: Infinity,
    }),
  languageForm: () =>
    queryOptions({
      queryKey: ["languageForm"],
      queryFn: getLanguageFormInitValues,
    }),
} as const;
