import { apiClient } from "../../../utils/apiClient";
import { objToFormData } from "../../../utils/utils";
import type {
  SentencesResponse,
  Tag,
  TermDetail,
  TermPopup,
  TermsList,
  TermSuggestion,
} from "./types";

const BASE_URL = "/terms";

export const api = {
  getAll(filters?: string): Promise<TermsList> {
    return apiClient.get(filters ? `${BASE_URL}/?${filters}` : `${BASE_URL}/`);
  },

  getById(id: number): Promise<TermDetail> {
    return apiClient.get(`${BASE_URL}/${id}`);
  },

  getByText(text: string, langId: number) {
    return apiClient.get(`${BASE_URL}/${text}/${langId}`);
  },

  getPopup(id: number): Promise<TermPopup> {
    return apiClient.get(`${BASE_URL}/${id}/popup`);
  },

  getSuggestions(text: string, langId: number): Promise<TermSuggestion[]> {
    return apiClient.get(`${BASE_URL}/${text}/${langId}/suggestions`);
  },

  getSentences(text: string, langId: number): Promise<SentencesResponse> {
    return apiClient.get(`${BASE_URL}/${text}/${langId}/sentences`);
  },

  getTags(): Promise<Tag[]> {
    return apiClient.get(`${BASE_URL}/tags`);
  },

  getTagSuggestions(): Promise<string[]> {
    return apiClient.get(`${BASE_URL}/tags/suggestions`);
  },

  create(data: TermDetail) {
    return apiClient.post(BASE_URL, {
      body: objToFormData(data),
    });
  },

  edit(id: number, data: TermDetail) {
    return apiClient.patch(`${BASE_URL}/${id}`, {
      body: objToFormData(data),
    });
  },

  delete(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
};
