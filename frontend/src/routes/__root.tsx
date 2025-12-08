import {
  createRootRouteWithContext,
  Outlet,
  stripSearchParams,
  useParams,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Layout } from "../components/Layout/Layout";
import type { TextDirection } from "#resources/types";

interface Search {
  langId?: number;
  langName?: string;
  textDir?: TextDirection;
}

const defaultSearch: Search = {
  langId: undefined,
  langName: undefined,
  textDir: undefined,
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): Search => ({
    // language id should be defined with text direction
    langId:
      search.langId !== undefined && search.textDir !== undefined
        ? Number(search.langId)
        : defaultSearch.langId,
    textDir:
      search.langId !== undefined && search.textDir !== undefined
        ? (search.textDir as TextDirection)
        : defaultSearch.textDir,
    langName:
      search.langName !== undefined
        ? String(search.langName)
        : defaultSearch.langName,
  }),
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
});

function RouteComponent() {
  const { bookId } = useParams({ strict: false });
  return (
    <>
      {bookId !== undefined ? <Outlet /> : <Layout />}
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </>
  );
}
