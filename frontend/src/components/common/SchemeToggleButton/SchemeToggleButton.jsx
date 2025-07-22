import { useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { applyLuteHighlights } from "@actions/general";
import { settingsQuery } from "@settings/api/settings";

export function SchemeToggleButton({ onClick = null }) {
  const { data: settings } = useQuery(settingsQuery);
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const Icon = colorScheme === "dark" ? IconSun : IconMoon;

  function handleToggleScheme() {
    const newScheme = computedColorScheme === "dark" ? "light" : "dark";
    setColorScheme(newScheme);
    applyLuteHighlights(settings.highlights.status, newScheme);
    applyLuteHighlights(settings.highlights.general, newScheme);
  }

  return (
    <ActionIcon
      display="block"
      variant="subtle"
      size="lg"
      onClick={() => {
        handleToggleScheme();
        onClick && onClick();
      }}>
      <Icon size="90%" />
    </ActionIcon>
  );
}
