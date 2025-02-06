import { Group, Text } from "@mantine/core";
import DeleteLanguageButton from "./DeleteLanguageButton/DeleteLanguageButton";

function LanguageRadioLabel() {
  return (
    <Group wrap="nowrap" gap={5} align="center">
      <Text component="span" fw={500} fz="sm">
        My languages
      </Text>
      <DeleteLanguageButton />
    </Group>
  );
}

export default LanguageRadioLabel;
