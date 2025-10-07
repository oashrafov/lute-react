import { BASE_API_URL } from "../../../resources/constants";

const root = `${BASE_API_URL}/books/`;

export const endpoints = {
  getBooks: root,
  getBook: (id: number) => `${root}${id}`,
  getBookStats: (id: number) => `${root}${id}/stats`,
  getPage: (bookId: number, pageNum: number) =>
    `${root}${bookId}/pages/${pageNum}`,
  createBook: `${root}new`,
  editBook: (id: number) => `${root}${id}`,
  deleteBook: (id: number) => `${root}${id}`,
  getBookDataFromUrl: `${root}url`,
  commitPage: (bookId: number, pageNum: number) =>
    `${root}${bookId}/pages/${pageNum}`,
  getBookFormInitValues: `${root}form`,
} as const;
