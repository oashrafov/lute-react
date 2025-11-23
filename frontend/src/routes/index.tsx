import { createFileRoute, redirect } from "@tanstack/react-router";
import { HomePage } from "#pages/HomePage";
import { queries as langQueries } from "#language/api/queries";
import { queries as settingsQueries } from "#settings/api/queries";

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: async ({ context }) => {
    const responses = await Promise.all([
      context.queryClient.ensureQueryData(settingsQueries.appInfo()),
      context.queryClient.ensureQueryData(settingsQueries.init()),
      context.queryClient.ensureQueryData(
        langQueries.predefinedLanguagesList()
      ),
    ]);

    const initial = responses[1];
    if (!initial.haveBooks && initial.haveLanguages) {
      redirect({ to: "/create-book" });
      return;
    }

    return responses;
  },
});
