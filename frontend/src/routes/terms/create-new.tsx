import { createFileRoute } from "@tanstack/react-router";
import { query as termQuery } from "#term/api/query";
import { query as settingsQuery } from "#settings/api/query";
import { NewTermPage } from "#pages/NewTermPage";

export const Route = createFileRoute("/terms/create-new")({
  component: NewTermPage,
  loader: async ({ context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(termQuery.tagSuggestions()),
      context.queryClient.ensureQueryData(termQuery.tags()),
      context.queryClient.ensureQueryData(settingsQuery.init()),
    ]);
  },
});
