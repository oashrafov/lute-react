import {
  getLanguageParsers,
  getPredefinedLanguage,
  getPredefinedLanguages,
  getUserLanguage,
  getUserLanguages,
} from "./api";
import { keys } from "./keys";

const userLanguageQuery = (id) => ({
  queryKey: keys.userLanguage(id),
  queryFn: () => getUserLanguage(id),
  enabled: id != null && id !== "0",
  refetchOnWindowFocus: false,
});

const predefinedLanguageQuery = (langName) => ({
  queryKey: keys.predefinedLanguage(langName),
  queryFn: () => getPredefinedLanguage(langName),
  staleTime: Infinity,
});

const predefinedLanguagesQuery = {
  queryKey: keys.predefinedLanguages,
  queryFn: getPredefinedLanguages,
  staleTime: Infinity,
};

const userLanguagesQuery = {
  queryKey: keys.userLanguages,
  queryFn: getUserLanguages,
};

const parsersQuery = {
  queryKey: keys.parsers,
  queryFn: getLanguageParsers,
  staleTime: Infinity,
};

export {
  userLanguagesQuery,
  predefinedLanguagesQuery,
  parsersQuery,
  userLanguageQuery,
  predefinedLanguageQuery,
};
