import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { query as langQuery } from "#language/api/query";
import { query as settingsQuery } from "#settings/api/query";
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
      context.queryClient.ensureQueryData(langQuery.predefinedLanguagesList()),
      context.queryClient.ensureQueryData(langQuery.userLanguagesList()),
      context.queryClient.ensureQueryData(langQuery.parsers()),
      context.queryClient.ensureQueryData(langQuery.languageForm()),
      context.queryClient.ensureQueryData(settingsQuery.init()),
      context.queryClient.ensureQueryData(bookQuery.bookForm()),
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
