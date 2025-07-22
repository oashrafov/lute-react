import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useComputedColorScheme } from "@mantine/core";
import { startHoverMode } from "@actions/interactions-desktop";
import { applyLuteHighlights } from "@actions/general";
import { settingsQuery } from "@settings/api/settings";

export function useInitializePage() {
  const colorScheme = useComputedColorScheme();
  const { data: settings } = useQuery(settingsQuery);

  useEffect(() => {
    startHoverMode();
    applyLuteHighlights(settings.highlights.status, colorScheme);
    applyLuteHighlights(settings.highlights.general, colorScheme);
  }, [colorScheme, settings.highlights.general, settings.highlights.status]);
}
