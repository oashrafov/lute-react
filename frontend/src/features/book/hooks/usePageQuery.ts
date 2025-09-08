import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { queries } from "../api/queries";

export function usePageQuery() {
  const { id, page } = useParams();
  return useQuery(queries.page(Number(id), Number(page)));
}
