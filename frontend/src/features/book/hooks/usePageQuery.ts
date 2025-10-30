import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queries } from "../api/queries";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function usePageQuery() {
  const { bookId, pageNum } = route.useParams();
  return useSuspenseQuery(queries.page(bookId, pageNum));
}
