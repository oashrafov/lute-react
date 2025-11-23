import { createFileRoute, redirect } from "@tanstack/react-router";
import { HomePage } from "#pages/HomePage";
import { query as langQuery } from "#language/api/query";
import { query as settingsQuery } from "#settings/api/query";

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async ({ context }) => {
    const responses = await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery.appInfo()),
      context.queryClient.ensureQueryData(settingsQuery.init()),
      context.queryClient.ensureQueryData(langQuery.predefinedLanguagesList()),
    ]);

    const initial = responses[1];
    if (!initial.haveBooks && initial.haveLanguages) {
      redirect({ to: "/create-book" });
      return;
    }

    return responses;
  },
});
