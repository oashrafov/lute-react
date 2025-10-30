import { useEffect } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editBook } from "../api/api";
import { queries } from "../api/queries";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function useMarkAsStale() {
  const queryClient = useQueryClient();
  const { bookId } = route.useParams();

  const { mutate } = useMutation({
    mutationFn: editBook,
    onSuccess: (response) =>
      queryClient.invalidateQueries({
        queryKey: queries.stats(response.id).queryKey,
      }),
  });

  useEffect(() => {
    mutate({
      id: bookId,
      data: { action: "markAsStale" },
    });
  }, [bookId, mutate]);
}
