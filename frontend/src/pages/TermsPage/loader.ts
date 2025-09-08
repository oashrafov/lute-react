import type { QueryClient } from "@tanstack/react-query";
import { queries as langQueries } from "../../features/language/api/queries";
import { queries as termQueries } from "../../features/term/api/queries";
import { queries as settingsQueries } from "../../features/settings/api/queries";

export function loader(queryClient: QueryClient) {
  return async () => {
    await Promise.all([
      queryClient.ensureQueryData(langQueries.userLanguagesList()),
      queryClient.ensureQueryData(termQueries.tagSuggestions()),
      queryClient.ensureQueryData(termQueries.tags()),
      queryClient.ensureQueryData(settingsQueries.init()),
    ]);

    return null;
  };
}
