import { ActionIcon, Tooltip } from "@mantine/core";
import { IconSpeakerphone } from "@tabler/icons-react";

function PronunciationButton({ onToggle }) {
  return (
    <Tooltip label="Show pronunciation">
      <ActionIcon size="md" variant="subtle" onClick={onToggle}>
        <IconSpeakerphone />
      </ActionIcon>
    </Tooltip>
  );
}

export default PronunciationButton;
