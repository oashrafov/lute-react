import { useEffect } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { mutation } from "../../../api/mutation";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function useProcessPage() {
  const { bookId, pageNum } = route.useParams();
  const { mutate, isSuccess } = mutation.useProcessPage();

  useEffect(() => mutate({ bookId, pageNum }), [bookId, mutate, pageNum]);

  return isSuccess;
}
