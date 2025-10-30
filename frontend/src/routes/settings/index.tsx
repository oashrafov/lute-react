import { createFileRoute } from "@tanstack/react-router";
import { queries } from "../../features/settings/api/queries";
import { SettingsPage } from "../../pages/SettingsPage";

export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(queries.settingsForm()),
});
