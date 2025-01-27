import { getPageQuery } from "@book/api/query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

function usePrefetchPages(bookId, pageNum, pageCount) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const nextPage = Number(pageNum) + 1;
    const prevPage = Number(pageNum) - 1;

    if (nextPage <= pageCount) {
      queryClient.prefetchQuery(getPageQuery(bookId, String(nextPage)));
    }
    if (prevPage >= 1) {
      queryClient.prefetchQuery(getPageQuery(bookId, String(prevPage)));
    }
  }, [pageCount, bookId, pageNum, queryClient]);
}

export default usePrefetchPages;
