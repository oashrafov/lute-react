import { ActionIcon } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";

function InsertDictionaryButton({ form }) {
  return (
    <ActionIcon
      variant="transparent"
      color="green.6"
      onClick={() =>
        form.insertListItem("dictionaries", {
          for: "terms",
          type: "embedded",
          url: "",
          active: false,
          key: randomId(),
        })
      }>
      <IconSquareRoundedPlusFilled />
    </ActionIcon>
  );
}

export default InsertDictionaryButton;
