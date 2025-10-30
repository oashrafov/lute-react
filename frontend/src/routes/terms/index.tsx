import { createFileRoute } from "@tanstack/react-router";
import { queries as langQueries } from "../../features/language/api/queries";
import { queries as termQueries } from "../../features/term/api/queries";
import { queries as settingsQueries } from "../../features/settings/api/queries";
import { TermsPage } from "../../pages/TermsPage";

export const Route = createFileRoute("/terms/")({
  component: TermsPage,
  loader: async ({ context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(langQueries.userLanguagesList()),
      context.queryClient.ensureQueryData(termQueries.tagSuggestions()),
      context.queryClient.ensureQueryData(termQueries.tags()),
      context.queryClient.ensureQueryData(settingsQueries.init()),
    ]);
  },
});
