import { useEffect } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commitPage } from "../../../api/api";
import { queries } from "../../../api/queries";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function useProcessPage() {
  const queryClient = useQueryClient();
  const { bookId, pageNum } = route.useParams();

  const { mutate, isSuccess } = useMutation({
    mutationFn: commitPage,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queries.list().queryKey }),
  });

  useEffect(
    () => mutate({ id: bookId, page: pageNum }),
    [bookId, mutate, pageNum]
  );

  return isSuccess;
}
