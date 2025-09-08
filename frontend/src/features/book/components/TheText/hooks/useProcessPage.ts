import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { commitPage } from "../../../api/api";
import { queries } from "../../../api/queries";

export function useProcessPage() {
  const { id, page } = useParams();
  const queryClient = useQueryClient();
  const [pageProcessed, setPageProcessed] = useState(false);

  const { mutate } = useMutation({
    mutationFn: commitPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.list().queryKey });
      setPageProcessed(true);
    },
  });

  useEffect(() => {
    mutate({ id: Number(id), page: Number(page) });
  }, [id, mutate, page]);

  return pageProcessed;
}
