import type { QueryClient } from "@tanstack/react-query";
import { queries as langQueries } from "../../features/language/api/queries";
import { queries as settingsQueries } from "../../features/settings/api/queries";
import { queries as bookQueries } from "../../features/book/api/queries";

export function loader(queryClient: QueryClient) {
  return async () => {
    return await Promise.all([
      queryClient.ensureQueryData(langQueries.predefinedLanguagesList()),
      queryClient.ensureQueryData(langQueries.userLanguagesList()),
      queryClient.ensureQueryData(langQueries.parsers()),
      queryClient.ensureQueryData(settingsQueries.init()),
      queryClient.ensureQueryData(langQueries.languageForm()),
      queryClient.ensureQueryData(bookQueries.bookForm()),
    ]);
  };
}
