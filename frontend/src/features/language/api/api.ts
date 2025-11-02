import { apiClient } from "../../../utils/apiClient";
import type {
  UserLanguageDetail,
  UserLanguagesList,
  LanguageForm,
  PredefinedLanguageDetail,
  LanguageParser,
} from "./types";

const BASE_URL = "/languages";

export const api = {
  getUserLanguages(): Promise<UserLanguagesList> {
    return apiClient.get(`${BASE_URL}/user`);
  },

  getPredefinedLanguages(): Promise<string[]> {
    return apiClient.get(`${BASE_URL}/predefined`);
  },

  getUserLanguage(id: number): Promise<UserLanguageDetail> {
    return apiClient.get(`${BASE_URL}/user/${id}`);
  },

  getPredefinedLanguage(langName: string): Promise<PredefinedLanguageDetail> {
    return apiClient.get(`${BASE_URL}/predefined/${langName}`);
  },

  getParsers(): Promise<LanguageParser[]> {
    return apiClient.get(`${BASE_URL}/parsers`);
  },

  getFormValues(): Promise<LanguageForm> {
    return apiClient.get(`${BASE_URL}/form`);
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
