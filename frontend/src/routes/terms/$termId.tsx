import { createFileRoute, redirect } from "@tanstack/react-router";
import { EditTermPage } from "#pages/EditTermPage";

export const Route = createFileRoute("/terms/$termId")({
  component: EditTermPage,
  params: {
    parse: (params) => ({ termId: Number(params.termId) }),
  },
  beforeLoad: ({ search }: { search: Record<string, unknown> }) => {
    if (!search?.langId) {
      redirect({
        to: "/terms",
        throw: true,
      });
      return;
    }
  },
});
