import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { editBook } from "../api/api";
import { queries } from "../api/queries";

export function useMarkAsStale() {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { mutate } = useMutation({
    mutationFn: editBook,
    onSuccess: (response) =>
      queryClient.invalidateQueries({
        queryKey: queries.stats(response.id).queryKey,
      }),
  });

  useEffect(() => {
    mutate({
      id: Number(id),
      data: { action: "markAsStale" },
    });
  }, [id, mutate]);
}
