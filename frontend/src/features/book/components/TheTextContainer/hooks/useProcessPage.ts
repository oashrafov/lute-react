import { useEffect } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { mutation } from "../../../api/mutation";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function useProcessPage() {
  const { bookId, pageNum } = route.useParams();
  const processPageMutation = mutation.useProcessPage();

  useEffect(
    () => processPageMutation.mutate({ bookId, pageNum }),
    [bookId, processPageMutation.mutate, pageNum]
  );

  return processPageMutation.isSuccess;
}
