import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { query as langQuery } from "#language/api/query";
import { query as bookQuery } from "#book/api/query";
import { CreateBookPage } from "#pages/CreateBookPage/CreateBookPage";

interface Search {
  langForm?: boolean;
}

const defaultSearch: Search = {
  langForm: false,
};

export const Route = createFileRoute("/create-book")({
  component: CreateBookPage,
  loader: async ({ context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(bookQuery.form()),
      context.queryClient.ensureQueryData(langQuery.form()),
      context.queryClient.ensureQueryData(langQuery.parsers()),
    ]);
  },
  validateSearch: (search: Record<string, unknown>): Search => ({
    langForm:
      search.langForm !== undefined
        ? Boolean(search.langForm)
        : defaultSearch.langForm,
  }),
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
});
