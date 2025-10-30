import { createFileRoute } from "@tanstack/react-router";
import { queries as langQueries } from "../features/language/api/queries";
import { queries as settingsQueries } from "../features/settings/api/queries";
import { queries as bookQueries } from "../features/book/api/queries";
import { NewBookPage } from "../pages/NewBookPage/NewBookPage";

export const Route = createFileRoute("/create-book")({
  component: NewBookPage,
  loader: async ({ context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(
        langQueries.predefinedLanguagesList()
      ),
      context.queryClient.ensureQueryData(langQueries.userLanguagesList()),
      context.queryClient.ensureQueryData(langQueries.parsers()),
      context.queryClient.ensureQueryData(langQueries.languageForm()),
      context.queryClient.ensureQueryData(settingsQueries.init()),
      context.queryClient.ensureQueryData(bookQueries.bookForm()),
    ]);
  },
});
