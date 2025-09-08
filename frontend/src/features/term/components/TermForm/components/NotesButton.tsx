import { ActionIcon, Tooltip } from "@mantine/core";
import { IconNote } from "@tabler/icons-react";
import type { MouseEventHandler } from "react";

interface NotesButton {
  onToggle: MouseEventHandler<HTMLButtonElement>;
  active: boolean;
}

export function NotesButton({ onToggle, active }: NotesButton) {
  return (
    <Tooltip label="Show notes">
      <ActionIcon
        size="md"
        variant={active ? "light" : "subtle"}
        onClick={onToggle}>
        <IconNote />
      </ActionIcon>
    </Tooltip>
  );
}
