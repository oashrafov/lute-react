import { ActionIcon, Tooltip } from "@mantine/core";
import { IconLetterCaseLower } from "@tabler/icons-react";
import type { MouseEventHandler } from "react";

interface ToLowerCaseButton {
  onClick: MouseEventHandler<HTMLButtonElement>;
  enabled: boolean;
}

export function ToLowerCaseButton({ onClick, enabled }: ToLowerCaseButton) {
  return (
    <Tooltip label="Make lowercase">
      <ActionIcon
        size="md"
        variant="subtle"
        onClick={onClick}
        disabled={!enabled}>
        <IconLetterCaseLower />
      </ActionIcon>
    </Tooltip>
  );
}
