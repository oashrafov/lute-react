import { memo } from "react";
import { ActionIcon, Group } from "@mantine/core";
import {
  IconCircleXFilled,
  IconDeviceFloppy,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

function EditButtonsCell({ row, table, isEditing }) {
  return isEditing ? (
    <Group wrap="nowrap" gap={5}>
      <ActionIcon
        size="sm"
        variant="transparent"
        color="red.6"
        onClick={() => {
          table.setEditingRow(null);
        }}>
        <IconCircleXFilled />
      </ActionIcon>
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={() => {
          table.setEditingRow(null);
        }}>
        <IconDeviceFloppy />
      </ActionIcon>
    </Group>
  ) : (
    <Group wrap="nowrap" gap={5}>
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={() => {
          table.setEditingRow(row);
        }}>
        <IconEdit />
      </ActionIcon>
      <ActionIcon size="sm" variant="transparent" color="red.6">
        <IconTrash />
      </ActionIcon>
    </Group>
  );
}

export default memo(EditButtonsCell);
