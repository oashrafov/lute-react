import {
  createFileRoute,
  redirect,
  stripSearchParams,
} from "@tanstack/react-router";
import type { View } from "#resources/types";
import { BookPage } from "#pages/BookPage";
import { queries as bookQueries } from "#book/api/queries";
import { queries as langQueries } from "#language/api/queries";
import { queries as settingsQueries } from "#settings/api/queries";

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
        bookQueries.detail(params.bookId)
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
        langQueries.userLanguageDetail(bookData.languageId)
      ),
      context.queryClient.ensureQueryData(
        bookQueries.page(params.bookId, params.pageNum)
      ),
      context.queryClient.ensureQueryData(settingsQueries.settingsForm()),
      context.queryClient.ensureQueryData(settingsQueries.shortcuts()),
      context.queryClient.ensureQueryData(settingsQueries.appInfo()),
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
