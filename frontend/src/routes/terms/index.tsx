import { createFileRoute } from "@tanstack/react-router";
import { query as langQuery } from "#language/api/query";
import { query as termQuery } from "#term/api/query";
import { query as settingsQuery } from "#settings/api/query";
import { TermsPage } from "#pages/TermsPage";

export const Route = createFileRoute("/terms/")({
  component: TermsPage,
  loader: async ({ context }) =>
    await Promise.all([
      context.queryClient.ensureQueryData(langQuery.userLanguagesList()),
      context.queryClient.ensureQueryData(termQuery.tagSuggestions()),
      context.queryClient.ensureQueryData(termQuery.tags()),
      context.queryClient.ensureQueryData(settingsQuery.init()),
    ]),
});
