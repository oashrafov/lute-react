import type { QueryClient } from "@tanstack/react-query";
import { queries } from "../../features/settings/api/queries";

export function loader(queryClient: QueryClient) {
  return async () => await queryClient.ensureQueryData(queries.shortcuts());
}
