import { createFileRoute } from "@tanstack/react-router";
import { queries } from "#settings/api/queries";
import { BackupsPage } from "#pages/BackupsPage";

export const Route = createFileRoute("/backups")({
  component: BackupsPage,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(queries.backups()),
});
