import { useState } from "react";
import {
  Select,
  useMantineColorScheme,
  type MantineColorScheme,
} from "@mantine/core";
import { IconPalette } from "@tabler/icons-react";

export function ThemeSelect() {
  const { setColorScheme } = useMantineColorScheme();

  const userThemes = ["LWT", "Lute", "Night"] as const; // mock
  const themes = ["Light", "Dark", ...userThemes] as const;
  type Theme = (typeof themes)[number];

  const [theme, setTheme] = useState<Theme>("Light");

  function handleToggleScheme(theme: Theme) {
    if (theme === "Light" || theme === "Dark") {
      setColorScheme(theme.toLowerCase() as MantineColorScheme);
    }

    setTheme(theme);
  }

  const selectData = themes.map((theme) => ({
    label: theme,
    value: theme,
  }));

  return (
    <Select
      size="xs"
      w={120}
      value={theme}
      onChange={(val) => handleToggleScheme(val as Theme)}
      allowDeselect={false}
      data={selectData}
      leftSection={<IconPalette size={16} />}
    />
  );
}
