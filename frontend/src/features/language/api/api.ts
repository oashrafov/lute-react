import { apiClient } from "#utils/apiClient";
import type {
  UserLanguageDetail,
  UserLanguagesList,
  LanguageForm,
  PredefinedLanguageDetail,
  LanguageParser,
} from "./types";

const BASE_URL = "/languages";

export const api = {
  getUserLanguages() {
    return apiClient.get<UserLanguagesList>(`${BASE_URL}/user`);
  },

  getPredefinedLanguages() {
    return apiClient.get<string[]>(`${BASE_URL}/predefined`);
  },

  getUserLanguage(id: number) {
    return apiClient.get<UserLanguageDetail>(`${BASE_URL}/user/${id}`);
  },

  getPredefinedLanguage(langName: string) {
    return apiClient.get<PredefinedLanguageDetail>(
      `${BASE_URL}/predefined/${langName}`
    );
  },

  getParsers() {
    return apiClient.get<LanguageParser[]>(`${BASE_URL}/parsers`);
  },

  getFormValues() {
    return apiClient.get<LanguageForm>(`${BASE_URL}/form`);
  },

  create(name: string, loadStories?: boolean) {
    return apiClient.post(BASE_URL, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, loadStories }),
    });
  },
};
