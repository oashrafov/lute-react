import type { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconArchive,
  IconArchiveFilled,
  IconArchiveOff,
  IconCircleCheckFilled,
  IconDots,
  IconEdit,
  IconHeadphonesFilled,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { TagsGroup } from "../../../../components/common/TagsGroup/TagsGroup";
import { StatsBar } from "../StatsBar/StatsBar";
import { LanguageCell } from "../../../../components/common/LanguageCell/LanguageCell";
import { useDeleteBook, useEditBook } from "../../api/mutation";
import { deleteBookConfirm } from "../../../../resources/modals";
import type {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_Row,
} from "mantine-react-table";
import type { BooksListItem, EditAction } from "../../api/types";
import type { LanguageChoice } from "../../../settings/api/types";

export const columnDefinition = (
  languageChoices: LanguageChoice[],
  tagChoices: string[],
  onSetColumnFilters: Dispatch<SetStateAction<MRT_ColumnFiltersState>>,
  setEditedRow: Dispatch<SetStateAction<MRT_Row<BooksListItem> | null>>,
  setShelf: Dispatch<SetStateAction<"all" | "active" | "archived">>
): MRT_ColumnDef<BooksListItem>[] => [
  {
    header: "TITLE",
    accessorKey: "title",
    size: 500,
    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    Cell: ({ row }) => {
      const id = row.original.id;
      const title = row.original.title;
      const currentPage = row.original.currentPage;
      const pageCount = row.original.pageCount;
      const isCompleted = row.original.isCompleted;
      const isArchived = row.original.isArchived;
      const hasAudio = row.original.audioName;
      return (
        <Group gap={5} align="center" wrap="nowrap" maw={400}>
          <ThemeIcon
            size="sm"
            color={isCompleted ? "green.6" : "dark.1"}
            variant="transparent">
            <IconCircleCheckFilled />
          </ThemeIcon>
          <Button
            c="inherit"
            fw="normal"
            td="none"
            variant="subtle"
            size="compact-sm"
            component={Link}
            to={`/books/${id}/pages/${currentPage}`}>
            {title}
          </Button>
          {currentPage > 1 && currentPage !== pageCount && (
            <Text component="span" size="xs" c="dimmed">
              ({currentPage}/{pageCount})
            </Text>
          )}
          {hasAudio && (
            <ThemeIcon
              size="xs"
              variant="transparent"
              color="dimmed"
              opacity="0.4">
              <IconHeadphonesFilled />
            </ThemeIcon>
          )}
          {isArchived && (
            <ThemeIcon
              size="xs"
              variant="transparent"
              color="dimmed"
              opacity="0.4">
              <IconArchiveFilled />
            </ThemeIcon>
          )}
        </Group>
      );
    },
  },
  {
    header: "LANGUAGE",
    accessorKey: "language",
    filterVariant: "select",
    columnFilterModeOptions: null,
    mantineFilterSelectProps: {
      data: languageChoices.map((lang) => lang.name),
    },
    Cell: ({ row }) => (
      <LanguageCell
        language={row.original.language}
        onSetColumnFilters={onSetColumnFilters}
      />
    ),
  },
  {
    header: "WORD COUNT",
    accessorKey: "wordCount",
    columnFilterModeOptions: ["equals", "greaterThan", "lessThan", "notEquals"],
  },
  {
    header: "STATUS",
    id: "status",
    accessorKey: "unknownPercent",
    size: 200,
    Cell: ({ row }) => <StatsBar bookId={row.original.id} />,
    columnFilterModeOptions: ["equals", "greaterThan", "lessThan", "notEquals"],
    mantineFilterTextInputProps: {
      placeholder: "Filter by Unknown %",
    },
  },
  {
    header: "TAGS",
    id: "tags",
    mantineFilterSelectProps: {
      data: tagChoices,
    },
    filterVariant: "select",
    columnFilterModeOptions: null,
    size: 200,
    accessorFn: (row) => (row.tags.length > 0 ? row.tags.join() : ""),
    Cell: ({ row }) => <TagsGroup tags={row.original.tags} />,
  },
  {
    header: "LAST READ",
    id: "lastRead",
    accessorKey: "lastRead",
    columnFilterModeOptions: null,
    enableColumnFilter: false,
    Cell: ({ row }) =>
      row.original.lastRead && (
        <span>{dayjs(row.original.lastRead).fromNow()}</span>
      ),
  },
  {
    id: "actions",
    header: "",
    columnDefType: "display",
    size: 0,
    Cell: ({ row }) => {
      const editBookMutation = useEditBook();
      const deleteBookMutation = useDeleteBook();

      function handleEdit(id: number, data: EditAction) {
        editBookMutation.mutate(
          {
            id: id,
            data: data,
          },
          {
            onSuccess: (response) => {
              if (response.archivedCount === 0) {
                setShelf("active");
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
              onClick={() => setEditedRow(row)}>
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
                onClick={() =>
                  handleEdit(row.original.id, { action: "archive" })
                }>
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
    },
  },
];
