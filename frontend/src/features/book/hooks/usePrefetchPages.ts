import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useBookQuery } from "./useBookQuery";
import { queries } from "../api/queries";

export function usePrefetchPages() {
  const queryClient = useQueryClient();
  const { data: book } = useBookQuery();
  const { id: bookId, page: pageNum } = useParams();

  useEffect(() => {
    const nextPage = Number(pageNum) + 1;
    const prevPage = Number(pageNum) - 1;

    if (nextPage <= book.pageCount) {
      queryClient.prefetchQuery(queries.page(Number(bookId), nextPage));
    }
    if (prevPage >= 1) {
      queryClient.prefetchQuery(queries.page(Number(bookId), prevPage));
    }
  }, [book.pageCount, bookId, pageNum, queryClient]);
}
