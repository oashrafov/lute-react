import { useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { applyLuteHighlights } from "@actions/general";
import { settingsQuery } from "@settings/api/settings";

function SchemeToggleButton({ onCloseDrawer = null }) {
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
        onCloseDrawer && onCloseDrawer();
      }}>
      <Icon size="90%" />
    </ActionIcon>
  );
}

export default SchemeToggleButton;
