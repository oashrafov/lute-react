import { ActionIcon, Tooltip } from "@mantine/core";
import { IconSpeakerphone } from "@tabler/icons-react";
import type { MouseEventHandler } from "react";

interface PronunciationButton {
  onToggle: MouseEventHandler<HTMLButtonElement>;
  active: boolean;
}

export function PronunciationButton({ onToggle, active }: PronunciationButton) {
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
