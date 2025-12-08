import { API_BASE_URL } from "#resources/constants";
import { apiClient } from "#utils/apiClient";
import { objToFormData } from "#utils/utils";
import type {
  BookDetail,
  BooksList,
  BookStats,
  EditAction,
  CreateBookForm,
  Page,
  CreateBookResponse,
  EditBookResponse,
  DeleteBookResponse,
  GenerateContentFromURLResponse,
  GenerateContentFromFileResponse,
} from "./types";

const BASE_URL = "/books";
import { createBookFormSchema } from "./schemas";

export const api = {
  getById(id: number) {
    return apiClient.get<BookDetail>(`${BASE_URL}/${id}`);
  },

  getAll(filters?: string) {
    return apiClient.get<BooksList>(
      filters ? `${BASE_URL}/?${filters}` : `${BASE_URL}/`
    );
  },

  getStats(id: number) {
    return apiClient.get<BookStats>(`${BASE_URL}/${id}/stats`);
  },

  getPage(bookId: number, pageNum: number) {
    return apiClient.get<Page>(`${BASE_URL}/${bookId}/pages/${pageNum}`);
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

  create(data: CreateBookForm) {
    return apiClient.post<CreateBookResponse>(`${BASE_URL}/`, {
      body: objToFormData(data),
    });
  },

  edit(id: number, data: EditAction) {
    return apiClient.patch<EditBookResponse>(`${BASE_URL}/${id}`, {
      body: objToFormData(data),
    });
  },

  delete(id: number) {
    return apiClient.delete<DeleteBookResponse>(`${BASE_URL}/${id}`);
  },

  generateContentFromURL(url: string) {
    return apiClient.post<GenerateContentFromURLResponse>(
      `${BASE_URL}/parse/url`,
      { headers: { "Content-Type": "text/plain" }, body: url }
    );
  },

  generateContentFromFile(file: File) {
    return apiClient.post<GenerateContentFromFileResponse>(
      `${BASE_URL}/parse/file`,
      { body: objToFormData({ file }) }
    );
  },

  processPage(bookId: number, pageNum: number) {
    return apiClient.post(`${BASE_URL}/${bookId}/pages/${pageNum}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shouldTrack: true }),
    });
  },

  getFormValues() {
    return apiClient.get<typeof createBookFormSchema>(`${BASE_URL}/form`);
  },
};
