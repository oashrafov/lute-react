import { ActionIcon, Tooltip } from "@mantine/core";
import { IconSpeakerphone } from "@tabler/icons-react";

function PronunciationButton({ onToggle, active }) {
  return (
    <Tooltip label="Show pronunciation">
      <ActionIcon
        size="md"
        variant={active ? "light" : "subtle"}
        onClick={onToggle}>
        <IconSpeakerphone />
      </ActionIcon>
    </Tooltip>
  );
}

export default PronunciationButton;
