import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queries } from "../api/queries";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function useBookQuery() {
  const { bookId } = route.useParams();
  return useSuspenseQuery(queries.detail(bookId));
}
