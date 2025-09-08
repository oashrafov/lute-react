import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useComputedColorScheme } from "@mantine/core";
import { startHoverMode } from "../../../../../helpers/interactions-desktop";
import { applyLuteHighlights } from "../../../../../helpers/general";
import { queries } from "../../../../settings/api/queries";

export function useInitializePage() {
  const colorScheme = useComputedColorScheme();
  const { data: settings } = useQuery(queries.settings());

  useEffect(() => {
    startHoverMode();
    if (settings) {
      applyLuteHighlights(settings.highlights.status, colorScheme);
      applyLuteHighlights(settings.highlights.general, colorScheme);
    }
  }, [colorScheme, settings]);
}
