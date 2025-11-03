import {
  keepPreviousData,
  queryOptions,
  skipToken,
} from "@tanstack/react-query";
import { api } from "./api";

export const queries = {
  all: () => ["books"],
  allStats: () => [...queries.all(), "stats"],
  allDetails: () => [...queries.all(), "detail"],
  bookPages: (bookId: number) => [queries.all(), "page", bookId],
  list: (filters?: string) =>
    queryOptions({
      queryKey: [...queries.all(), filters],
      queryFn: () => api.getAll(filters),
      placeholderData: keepPreviousData,
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...queries.allDetails(), id],
      queryFn: () => api.getById(id),
      refetchOnWindowFocus: false,
    }),
  stats: (id: number) =>
    queryOptions({
      queryKey: [...queries.allStats(), id],
      queryFn: () => api.getStats(id),
      enabled: id !== null,
    }),
  page: (bookId: number, pageNum: number) =>
    queryOptions({
      queryKey: [...queries.bookPages(bookId), pageNum],
      queryFn: () => api.getPage(bookId, pageNum),
      refetchOnWindowFocus: false,
    }),
  audio: (bookId?: number) =>
    queryOptions({
      queryKey: ["audio", bookId],
      queryFn: bookId ? () => api.getAudio(bookId) : skipToken,
      refetchOnWindowFocus: false,
    }),
  bookForm: () =>
    queryOptions({
      queryKey: ["bookForm"],
      queryFn: api.getFormValues,
    }),
} as const;
