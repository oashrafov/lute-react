import { ActionIcon, Tooltip } from "@mantine/core";
import { IconNote } from "@tabler/icons-react";

function NotesButton({ onToggle, active }) {
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

export default NotesButton;
