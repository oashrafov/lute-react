import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { commitPage } from "../../../api/api";
import { queries } from "../../../api/queries";

export function useProcessPage() {
  const queryClient = useQueryClient();
  const { id, page } = useParams();

  const { mutate, isSuccess } = useMutation({
    mutationFn: commitPage,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queries.list().queryKey }),
  });

  useEffect(
    () => mutate({ id: Number(id), page: Number(page) }),
    [id, mutate, page]
  );

  return isSuccess;
}
