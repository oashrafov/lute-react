import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { commitPage } from "@book/api/api";
import { keys } from "@book/api/keys";

function useProcessPage() {
  const { id, page } = useParams();
  const queryClient = useQueryClient();
  const [pageProcessed, setPageProcessed] = useState(false);

  const { mutate } = useMutation({
    mutationFn: commitPage,
    onSuccess: () => {
      queryClient.invalidateQueries(keys.books);
      setPageProcessed(true);
    },
  });

  useEffect(() => {
    mutate({ id, page });
  }, [id, mutate, page]);

  return pageProcessed;
}

export { useProcessPage };
