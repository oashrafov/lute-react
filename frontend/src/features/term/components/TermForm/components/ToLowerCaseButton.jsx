import { ActionIcon, Tooltip } from "@mantine/core";
import { IconLetterCaseLower } from "@tabler/icons-react";

function ToLowerCaseButton({ onClick }) {
  return (
    <Tooltip label="Make lowercase">
      <ActionIcon size="md" variant="subtle" onClick={onClick}>
        <IconLetterCaseLower />
      </ActionIcon>
    </Tooltip>
  );
}

export default ToLowerCaseButton;
