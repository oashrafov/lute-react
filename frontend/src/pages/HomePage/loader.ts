import type { QueryClient } from "@tanstack/react-query";
import { queries as langQueries } from "../../features/language/api/queries";
import { queries as settingsQueries } from "../../features/settings/api/queries";

export function loader(queryClient: QueryClient) {
  return async () =>
    await Promise.all([
      queryClient.ensureQueryData(settingsQueries.appInfo()),
      queryClient.ensureQueryData(settingsQueries.settings()),
      queryClient.ensureQueryData(settingsQueries.init()),
      queryClient.ensureQueryData(langQueries.predefinedLanguagesList()),
    ]);
}
