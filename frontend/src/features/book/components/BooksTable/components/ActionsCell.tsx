import type { Dispatch, SetStateAction } from "react";
import { ActionIcon, Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconArchive,
  IconArchiveOff,
  IconDots,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_Row } from "mantine-react-table";
import { deleteBookConfirm } from "../../../../../resources/modals";
import type { BooksListItem, EditAction } from "../../../api/types";
import { mutation } from "../../../api/mutation";

interface ActionsCell {
  row: MRT_Row<BooksListItem>;
  onEditedRow: Dispatch<SetStateAction<MRT_Row<BooksListItem> | null>>;
  onSetShelf: Dispatch<SetStateAction<"all" | "active" | "archived">>;
}

export function ActionsCell({ row, onEditedRow, onSetShelf }: ActionsCell) {
  const editBookMutation = mutation.useEditBook();
  const deleteBookMutation = mutation.useDeleteBook();

  function handleEdit(id: number, data: EditAction) {
    editBookMutation.mutate(
      {
        id: id,
        data: data,
      },
      {
        onSuccess: (response) => {
          if (response.archivedCount === 0) {
            onSetShelf("active");
          }
        },
      }
    );
  }

  return (
    <Menu shadow="sm">
      <Menu.Target>
        <ActionIcon size="sm" variant="subtle" display="block">
          <IconDots color="var(--mantine-color-dimmed)" />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          color="blue"
          leftSection={<IconEdit size={20} />}
          onClick={() => onEditedRow(row)}>
          Edit
        </Menu.Item>
        {row.original.isArchived ? (
          <Menu.Item
            color="orange"
            leftSection={<IconArchiveOff size={20} />}
            onClick={() =>
              handleEdit(row.original.id, { action: "unarchive" })
            }>
            Unarchive
          </Menu.Item>
        ) : (
          <Menu.Item
            color="orange"
            leftSection={<IconArchive size={20} />}
            onClick={() => handleEdit(row.original.id, { action: "archive" })}>
            Archive
          </Menu.Item>
        )}
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={20} />}
          onClick={() =>
            modals.openConfirmModal(
              deleteBookConfirm(row.original.title, () =>
                deleteBookMutation.mutate(row.original.id)
              )
            )
          }>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
