import { API_BASE_URL } from "../../../resources/constants";
import { apiClient } from "../../../utils/apiClient";
import { objToFormData } from "../../../utils/utils";
import type {
  BookDetail,
  BooksList,
  BookStats,
  EditAction,
  NewBookForm,
  Page,
} from "./types";

const BASE_URL = "/books";

export const api = {
  getById(id: number): Promise<BookDetail> {
    return apiClient.get(`${BASE_URL}/${id}`);
  },

  getAll(filters?: string): Promise<BooksList> {
    return apiClient.get(filters ? `${BASE_URL}/?${filters}` : `${BASE_URL}/`);
  },

  getStats(id: number): Promise<BookStats> {
    return apiClient.get(`${BASE_URL}/${id}/stats`);
  },

  getPage(bookId: number, pageNum: number): Promise<Page> {
    return apiClient.get(`${BASE_URL}/${bookId}/pages/${pageNum}`);
  },

  async getAudioSrc(bookId: number) {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${bookId}/audio`);

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  create(data: NewBookForm) {
    return apiClient.post(`${BASE_URL}/`, {
      body: objToFormData(data),
    });
  },

  edit(id: number, data: EditAction) {
    return apiClient.patch(`${BASE_URL}/${id}`, {
      body: objToFormData(data),
    });
  },

  delete(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  generateContentFromURL(url: string) {
    return apiClient.post(`${BASE_URL}/url`, {
      headers: {
        "Content-Type": "text/plain",
      },
      body: url,
    });
  },

  processPage(bookId: number, pageNum: number) {
    return apiClient.post(`${BASE_URL}/${bookId}/pages/${pageNum}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shouldTrack: true }),
    });
  },

  getFormValues(): Promise<NewBookForm> {
    return apiClient.get(`${BASE_URL}/form`);
  },
};
