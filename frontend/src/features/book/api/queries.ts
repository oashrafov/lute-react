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
  allPages: () => [...queries.all(), "page"],
  list: (filters?: string) =>
    queryOptions({
      queryKey: [...queries.all(), filters],
      queryFn: () => api.getAll(filters),
      placeholderData: keepPreviousData,
    }),
  detail: (bookId: number) =>
    queryOptions({
      queryKey: [...queries.allDetails(), bookId],
      queryFn: () => api.getById(bookId),
      refetchOnWindowFocus: false,
    }),
  stats: (bookId: number) =>
    queryOptions({
      queryKey: [...queries.allStats(), bookId],
      queryFn: () => api.getStats(bookId),
      enabled: bookId !== null,
    }),
  page: (bookId: number, pageNum: number) =>
    queryOptions({
      queryKey: [...queries.allPages(), bookId, pageNum],
      queryFn: () => api.getPage(bookId, pageNum),
      refetchOnWindowFocus: false,
    }),
  audioSrc: (bookId?: number) =>
    queryOptions({
      queryKey: ["audio", bookId],
      queryFn: bookId ? () => api.getAudioSrc(bookId) : skipToken,
      refetchOnWindowFocus: false,
    }),
  bookForm: () =>
    queryOptions({
      queryKey: ["bookForm"],
      queryFn: api.getFormValues,
    }),
} as const;
