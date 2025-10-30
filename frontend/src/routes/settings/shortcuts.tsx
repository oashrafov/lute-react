import { createFileRoute } from "@tanstack/react-router";
import { queries } from "../../features/settings/api/queries";
import ShortcutsPage from "../../pages/ShortcutsPage";

export const Route = createFileRoute("/settings/shortcuts")({
  component: ShortcutsPage,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(queries.shortcuts()),
});
