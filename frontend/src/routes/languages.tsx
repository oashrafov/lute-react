import { createFileRoute } from "@tanstack/react-router";
import { query as langQuery } from "#language/api/query.js";
import { query as settingsQuery } from "#settings/api/query";
import { LanguagesPage } from "#pages/LanguagesPage/LanguagesPage";

export const Route = createFileRoute("/languages")({
  component: LanguagesPage,
  loader: async ({ context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(langQuery.predefinedLanguagesList()),
      context.queryClient.ensureQueryData(langQuery.userLanguagesList()),
      context.queryClient.ensureQueryData(langQuery.parsers()),
      context.queryClient.ensureQueryData(langQuery.languageForm()),
      context.queryClient.ensureQueryData(settingsQuery.init()),
    ]);
  },
});
