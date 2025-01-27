import { ActionIcon, Tooltip } from "@mantine/core";
import { IconNotes } from "@tabler/icons-react";

function NotesButton({ onToggle }) {
  return (
    <Tooltip label="Show notes">
      <ActionIcon size="md" variant="subtle" onClick={onToggle}>
        <IconNotes />
      </ActionIcon>
    </Tooltip>
  );
}

export default NotesButton;
