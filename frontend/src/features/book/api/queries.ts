import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {
  getBook,
  getBookFormInitValues,
  getBooks,
  getBookStats,
  getPage,
} from "./api";

export const queries = {
  all: () => ["books"],
  allStats: () => [...queries.all(), "stats"],
  allDetails: () => [...queries.all(), "detail"],
  bookPages: (bookId: number) => [queries.all(), "page", bookId],
  list: (filters?: string) =>
    queryOptions({
      queryKey: [...queries.all(), filters],
      queryFn: () => getBooks(filters),
      placeholderData: keepPreviousData,
      staleTime: Infinity,
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...queries.allDetails(), id],
      queryFn: () => getBook(id),
      refetchOnWindowFocus: false,
    }),
  stats: (id: number) =>
    queryOptions({
      queryKey: [...queries.allStats(), id],
      queryFn: () => getBookStats(id),
      enabled: id !== null,
    }),
  page: (bookId: number, pageNum: number) =>
    queryOptions({
      queryKey: [...queries.bookPages(bookId), pageNum],
      queryFn: () => getPage(bookId, pageNum),
      refetchOnWindowFocus: false,
    }),
  bookForm: () =>
    queryOptions({
      queryKey: ["bookForm"],
      queryFn: getBookFormInitValues,
    }),
} as const;
