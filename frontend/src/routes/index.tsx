import {
  createFileRoute,
  redirect,
  stripSearchParams,
} from "@tanstack/react-router";
import { HomePage } from "../pages/HomePage";
import { queries as langQueries } from "../features/language/api/queries";
import { queries as settingsQueries } from "../features/settings/api/queries";

interface Search {
  langId?: number;
  langName?: string;
}

const defaultSearch = {
  langId: 0,
  langName: "",
};

export const Route = createFileRoute("/")({
  component: HomePage,
  validateSearch: (search: Record<string, unknown>): Search => ({
    langId: Number(search?.langId ?? defaultSearch.langId),
    langName: String(search?.langName ?? defaultSearch.langName),
  }),
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
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
});
