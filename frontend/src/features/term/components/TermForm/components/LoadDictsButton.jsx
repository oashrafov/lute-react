import { ActionIcon, Tooltip } from "@mantine/core";
import { IconVocabulary } from "@tabler/icons-react";

function LoadDictsButton({ enabled, onClick }) {
  return (
    <Tooltip label="Load dictionaries with the term">
      <ActionIcon disabled={!enabled} variant="subtle" onClick={onClick}>
        <IconVocabulary />
      </ActionIcon>
    </Tooltip>
  );
}

export default LoadDictsButton;
