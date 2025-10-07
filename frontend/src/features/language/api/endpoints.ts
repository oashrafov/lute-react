import { BASE_API_URL } from "../../../resources/constants";

const root = `${BASE_API_URL}/languages/`;

export const endpoints = {
  getUserLanguages: `${root}user`,
  getPredefinedLanguages: `${root}predefined`,
  getUserLanguage: (id: number) => `${root}user/${id}`,
  getPredefinedLanguage: (langName: string) => `${root}predefined/${langName}`,
  getLanguageParsers: `${root}parsers`,
  createLanguage: root,
  getLanguageFormInitValues: `${root}form`,
} as const;
