import { useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { applyLuteHighlights } from "../../../helpers/general";
import { queries } from "../../../features/settings/api/queries";

export function SchemeToggleButton({ onClick }: { onClick?: () => void }) {
  const { data: settings } = useQuery(queries.settings());
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const Icon = colorScheme === "dark" ? IconSun : IconMoon;

  function handleToggleScheme() {
    const newScheme = computedColorScheme === "dark" ? "light" : "dark";
    setColorScheme(newScheme);
    applyLuteHighlights(settings!.highlights.status, newScheme);
    applyLuteHighlights(settings!.highlights.general, newScheme);
  }

  function handleClick() {
    handleToggleScheme();
    onClick?.();
  }

  return (
    <ActionIcon
      display="block"
      variant="subtle"
      size="lg"
      onClick={handleClick}>
      <Icon size="90%" />
    </ActionIcon>
  );
}
