import type { QueryClient } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router-dom";
import { queries as bookQueries } from "../../features/book/api/queries";
import { queries as langQueries } from "../../features/language/api/queries";
import { queries as settingsQueries } from "../../features/settings/api/queries";

export function loader(queryClient: QueryClient) {
  return async ({ params }: LoaderFunctionArgs) => {
    const bookData = await queryClient.ensureQueryData(
      bookQueries.detail(Number(params.id))
    );
    return await Promise.all([
      queryClient.ensureQueryData(
        langQueries.userLanguageDetail(bookData.languageId)
      ),
      queryClient.ensureQueryData(
        bookQueries.page(Number(params.id), Number(params.page))
      ),
      queryClient.ensureQueryData(settingsQueries.settings()),
      queryClient.ensureQueryData(settingsQueries.appInfo()),
    ]);
  };
}
