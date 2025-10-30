import { createFileRoute } from "@tanstack/react-router";
import { queries as termQueries } from "../../features/term/api/queries";
import { queries as settingsQueries } from "../../features/settings/api/queries";
import { NewTermPage } from "../../pages/NewTermPage";

export const Route = createFileRoute("/terms/create-new")({
  component: NewTermPage,
  loader: async ({ context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(termQueries.tagSuggestions()),
      context.queryClient.ensureQueryData(termQueries.tags()),
      context.queryClient.ensureQueryData(settingsQueries.init()),
    ]);
  },
});
