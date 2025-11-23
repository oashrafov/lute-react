import {
  createFileRoute,
  redirect,
  stripSearchParams,
} from "@tanstack/react-router";
import type { View } from "#resources/types";
import { BookPage } from "#pages/BookPage";
import { query as bookQuery } from "#book/api/query";
import { query as settingsQuery } from "#settings/api/query";

type TermIds = number[];

interface Search {
  view?: View;
  termIds?: TermIds;
  sentenceId?: number;
}

const defaultSearch = {
  view: "default" as View,
  termIds: undefined,
  sentenceId: undefined,
};

export const Route = createFileRoute("/books/$bookId/pages/$pageNum/")({
  component: BookPage,
  params: {
    parse: (params) => ({ pageNum: Number(params.pageNum) }),
  },
  loaderDeps: ({ search: { langId, textDir } }) => ({ langId, textDir }),
  loader: async ({ context, params, deps: { langId, textDir } }) => {
    let bookData;
    try {
      bookData = await context.queryClient.ensureQueryData(
        bookQuery.detail(params.bookId)
      );
    } catch {
      redirect({
        throw: true,
        to: "/",
      });
      return;
    }

    if (params.pageNum > bookData.pageCount) {
      redirect({
        throw: true,
        params: { bookId: params.bookId, pageNum: bookData.pageCount },
        search: true,
      });
      return;
    }

    if (langId === undefined || textDir === undefined) {
      redirect({
        throw: true,
        search: (prev) => ({
          ...prev,
          langId: bookData.languageId,
          textDir: bookData.textDirection,
        }),
      });
      return;
    }

    const responses = await Promise.all([
      context.queryClient.ensureQueryData(
        bookQuery.page(params.bookId, params.pageNum)
      ),
      context.queryClient.ensureQueryData(settingsQuery.settingsForm()),
      context.queryClient.ensureQueryData(settingsQuery.shortcuts()),
      context.queryClient.ensureQueryData(settingsQuery.appInfo()),
    ]);

    return [bookData, ...responses];
  },
  validateSearch: (search: Record<string, unknown>): Search => ({
    view: (search?.view as View) ?? defaultSearch.view,
    termIds:
      search.termIds !== undefined
        ? (search.termIds as TermIds)
        : defaultSearch.termIds,
    sentenceId:
      search.sentenceId !== undefined
        ? Number(search.sentenceId)
        : defaultSearch.sentenceId,
  }),
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
});
