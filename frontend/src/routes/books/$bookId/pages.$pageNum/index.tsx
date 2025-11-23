import {
  createFileRoute,
  redirect,
  stripSearchParams,
} from "@tanstack/react-router";
import type { View } from "#resources/types";
import { BookPage } from "#pages/BookPage";
import { query as bookQuery } from "#book/api/query";
import { query as langQuery } from "#language/api/query.js";
import { query as settingsQuery } from "#settings/api/query";

type TermIds = number[];

interface Search {
  view?: View;
  termIds?: TermIds;
  sentenceId?: number;
}

const defaultSearch = {
  view: "default" as View,
  termIds: [],
  sentenceId: -1,
};

export const Route = createFileRoute("/books/$bookId/pages/$pageNum/")({
  component: BookPage,
  params: {
    parse: (params) => ({ pageNum: Number(params.pageNum) }),
  },
  loader: async ({ context, params }) => {
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

    const responses = await Promise.all([
      context.queryClient.ensureQueryData(
        langQuery.userLanguageDetail(bookData.languageId)
      ),
      context.queryClient.ensureQueryData(
        bookQuery.page(params.bookId, params.pageNum)
      ),
      context.queryClient.ensureQueryData(settingsQuery.settingsForm()),
      context.queryClient.ensureQueryData(settingsQuery.shortcuts()),
      context.queryClient.ensureQueryData(settingsQuery.appInfo()),
    ]);

    return [bookData, ...responses];
  },
  validateSearch: (search: Record<string, unknown>): Search => {
    return {
      view: (search?.view as View) ?? defaultSearch.view,
      termIds: (search?.termIds as TermIds) ?? defaultSearch.termIds,
    };
  },
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
});
