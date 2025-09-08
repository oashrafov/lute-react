import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { queries } from "../api/queries";

export function useBookQuery() {
  const { id } = useParams();
  return useQuery(queries.detail(Number(id)));
}
