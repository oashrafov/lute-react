import {
  createRootRouteWithContext,
  Outlet,
  useParams,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Layout } from "../components/Layout/Layout";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RouteComponent,
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
