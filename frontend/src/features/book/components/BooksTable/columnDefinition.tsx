import type { Dispatch, SetStateAction } from "react";
import type {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_Row,
} from "mantine-react-table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { TagsGroup } from "#common/TagsGroup/TagsGroup";
import { LanguageCell } from "#common/LanguageCell/LanguageCell";
import { StatusCell } from "./components/StatusCell/StatusCell";
import { TitleCell } from "./components/TitleCell";
import { ActionsCell } from "./components/ActionsCell";
import type { BooksListItem } from "#book/api/types";
import type { Shelf } from "#book/resources/types";
import type { LanguageChoice } from "#settings/api/types";

export const columnDefinition = (
  languageChoices: LanguageChoice[],
  tagChoices: string[],
  onSetColumnFilters: Dispatch<SetStateAction<MRT_ColumnFiltersState>>,
  setEditedRow: Dispatch<SetStateAction<MRT_Row<BooksListItem> | null>>,
  setShelf: Dispatch<SetStateAction<Shelf>>
): MRT_ColumnDef<BooksListItem>[] => [
  {
    header: "TITLE",
    accessorKey: "title",
    size: 500,
    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    Cell: ({ row }) => <TitleCell row={row} />,
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
    Cell: ({ row }) => <StatusCell bookId={row.original.id} />,
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
    Cell: ({ row }) => (
      <ActionsCell row={row} onEditedRow={setEditedRow} onSetShelf={setShelf} />
    ),
  },
];
