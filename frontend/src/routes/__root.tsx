import {
  createRootRouteWithContext,
  Outlet,
  retainSearchParams,
  stripSearchParams,
  useParams,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Layout } from "../components/Layout/Layout";
import type { TextDirection } from "#resources/types.ts";

interface Search {
  langId?: number;
  langName?: string;
  textDir?: TextDirection;
}

const defaultSearch: Search = {
  langId: 0,
  langName: "",
  textDir: "ltr",
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): Search => ({
    langId: Number(search?.langId ?? defaultSearch.langId),
    langName: String(search?.langName ?? defaultSearch.langName),
    textDir: String(search?.textDir ?? defaultSearch.textDir) as TextDirection,
  }),
  search: {
    middlewares: [
      stripSearchParams(defaultSearch),
      retainSearchParams(["langId", "textDir"]),
    ],
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
