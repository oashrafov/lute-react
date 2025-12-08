import { apiClient } from "#utils/apiClient";
import { objToFormData } from "#utils/utils";
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
  getAll(filters?: string) {
    return apiClient.get<TermsList>(
      filters ? `${BASE_URL}/?${filters}` : `${BASE_URL}/`
    );
  },

  getById(id: number) {
    return apiClient.get<TermDetail>(`${BASE_URL}/${id}`);
  },

  getByText(text: string, langId: number) {
    return apiClient.get<TermDetail>(`${BASE_URL}/${text}/${langId}`);
  },

  getPopup(id: number) {
    return apiClient.get<TermPopup>(`${BASE_URL}/${id}/popup`);
  },

  getSuggestions(text: string, langId: number) {
    return apiClient.get<TermSuggestion[]>(
      `${BASE_URL}/${text}/${langId}/suggestions`
    );
  },

  getSentences(text: string, langId: number) {
    return apiClient.get<SentencesResponse>(
      `${BASE_URL}/${text}/${langId}/sentences`
    );
  },

  getTags() {
    return apiClient.get<Tag[]>(`${BASE_URL}/tags`);
  },

  getTagSuggestions() {
    return apiClient.get<string[]>(`${BASE_URL}/tags/suggestions`);
  },

  create(data: TermDetail) {
    return apiClient.post(BASE_URL, {
      body: objToFormData(data),
    });
  },

  edit(data: TermDetail | Partial<TermDetail>[]) {
    if (Array.isArray(data)) {
      return _editMultiple(data);
    } else {
      return _editById(data);
    }
  },

  delete(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
};

function _editById(data: TermDetail) {
  return apiClient.patch(`${BASE_URL}/${data.id}`, {
    body: objToFormData(data),
  });
}

function _editMultiple(data: Partial<TermDetail>[]) {
  return apiClient.patch(`${BASE_URL}/`, {
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
