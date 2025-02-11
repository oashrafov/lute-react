import { ActionIcon, Tooltip } from "@mantine/core";
import { IconLetterCaseLower } from "@tabler/icons-react";

function ToLowerCaseButton({ onClick, enabled }) {
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

export default ToLowerCaseButton;
