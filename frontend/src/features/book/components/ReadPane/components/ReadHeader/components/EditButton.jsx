import { ActionIcon, rem } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

function EditButton({ onActivate }) {
  return (
    <ActionIcon
      onClick={onActivate}
      size={24}
      p={0}
      variant="transparent"
      styles={{ root: { border: "none" } }}>
      <IconEdit size={rem(22)} />
    </ActionIcon>
  );
}

export default EditButton;
