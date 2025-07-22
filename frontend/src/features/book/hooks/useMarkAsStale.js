import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "@book/api/keys";
import { editBook } from "@book/api/api";
import { getFormDataFromObj } from "@actions/utils";
import { useParams } from "react-router-dom";

export function useMarkAsStale() {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { mutate } = useMutation({
    mutationFn: editBook,
    onSuccess: (response) =>
      queryClient.invalidateQueries(keys.stats(response.id)),
  });

  useEffect(() => {
    mutate({
      id,
      data: getFormDataFromObj({ action: "markAsStale" }),
    });
  }, [id, mutate]);
}
