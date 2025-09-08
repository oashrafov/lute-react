import { ActionIcon, Center, Group } from "@mantine/core";
import { IconPalette } from "@tabler/icons-react";
import { useBookContext } from "../../../../features/book/hooks/useBookContext";
import { SchemeToggleButton } from "../../../common/SchemeToggleButton/SchemeToggleButton";

export function Actions() {
  const { drawer, themeForm } = useBookContext();
  return (
    <Center p={10}>
      <Group gap={5}>
        <SchemeToggleButton onClick={drawer.close} />
        <ActionIcon
          onClick={() => {
            themeForm.toggle();
            drawer.close();
          }}
          size="lg"
          variant="subtle">
          <IconPalette size="90%" />
        </ActionIcon>
      </Group>
    </Center>
  );
}
