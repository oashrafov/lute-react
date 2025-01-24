import { memo, useMemo, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Box, Menu, Modal, SegmentedControl } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  IconArchive,
  IconArchiveOff,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import EmptyRow from "@common/EmptyRow/EmptyRow";
import EditBookForm from "../EditBookForm/EditBookForm";
import getDefaultTableOptions from "@resources/table-options-default";
import columnDefinition from "./columnDefinition";
import { editBook, deleteBook } from "../../api/api";
import { bookDeleted, bookUpdated } from "../../resources/notifications";
import { keys } from "../../api/keys";
import { getFormDataFromObj } from "@actions/utils";

const defaultOptions = getDefaultTableOptions();

const PAGINATION = {
  pageIndex: 0,
  pageSize: 10,
};

const COLUMN_FILTER_FNS = {
  title: "contains",
  language: "contains",
  wordCount: "greaterThan",
  status: "greaterThan",
};

//build the URL (start=0&size=10&filters=[]&globalFilter=&sorting=[])
const fetchURL = new URL("/api/books", "http://localhost:5001");

function BooksTable({ languageChoices, tagChoices }) {
  const queryClient = useQueryClient();

  const [editedRow, setEditedRow] = useState(null);

  const columns = useMemo(
    () => columnDefinition(languageChoices, tagChoices),
    [languageChoices, tagChoices]
  );

  const [shelf, setShelf] = useState("active");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState(PAGINATION);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnFilterFns, setColumnFilterFns] = useState(COLUMN_FILTER_FNS);

  fetchURL.searchParams.set("shelf", shelf);
  fetchURL.searchParams.set(
    "start",
    `${pagination.pageIndex * pagination.pageSize}`
  );
  fetchURL.searchParams.set("size", `${pagination.pageSize}`);
  fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
  fetchURL.searchParams.set(
    "filterModes",
    JSON.stringify(columnFilterFns ?? {})
  );
  fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
  fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

  const { data } = useQuery({
    queryKey: ["books", fetchURL.href],
    queryFn: async () => {
      const response = await fetch(fetchURL.href);
      return await response.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: keys.books });
      notifications.show(bookDeleted(response.title));
    },
  });

  const editBookMutation = useMutation({
    mutationFn: editBook,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: keys.books });
      notifications.show(bookUpdated(response.title));
    },
  });

  function handleDelete(id) {
    deleteBookMutation.mutate(id);
  }

  function handleEdit(id, data) {
    editBookMutation.mutate({
      id: id,
      data: getFormDataFromObj(data),
    });
  }

  const table = useMantineReactTable({
    ...defaultOptions,

    columns: columns,
    data: data?.data || [],
    rowCount: data?.total,

    initialState: {
      ...defaultOptions.initialState,
      columnVisibility: {
        tags: false,
      },
    },

    state: {
      columnFilterFns,
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    },

    enableRowActions: true,
    enableColumnFilterModes: true,

    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "",
      },
    },

    renderEmptyRowsFallback: ({ table }) => {
      const language = table.getColumn("language").getFilterValue();
      const isLanguageFiltered = language?.length > 0;
      return isLanguageFiltered ? (
        <EmptyRow
          tableName="books"
          language={language}
          languageChoices={languageChoices}
        />
      ) : null;
    },

    renderRowActionMenuItems: ({ row }) => [
      <Menu.Item
        leftSection={<IconEdit />}
        key="edit"
        onClick={() => setEditedRow(row)}>
        Edit
      </Menu.Item>,

      row.original.isArchived ? (
        <Menu.Item
          leftSection={<IconArchiveOff />}
          key="unarchive"
          onClick={() => handleEdit(row.original.id, { action: "unarchive" })}>
          Unarchive
        </Menu.Item>
      ) : (
        <Menu.Item
          leftSection={<IconArchive />}
          key="archive"
          onClick={() => handleEdit(row.original.id, { action: "archive" })}>
          Archive
        </Menu.Item>
      ),

      <Menu.Item
        leftSection={<IconTrash />}
        key="delete"
        onClick={() => handleDelete(row.original.id)}>
        Delete
      </Menu.Item>,
    ],

    renderBottomToolbarCustomActions: () => (
      <ShelfSwitch shelf={shelf} onSetShelf={setShelf} />
    ),
  });

  return (
    <>
      {data && <MantineReactTable table={table} />}
      <EditModal
        row={editedRow}
        onClose={() => setEditedRow(null)}
        editBookMutation={editBookMutation}
      />
    </>
  );
}

function EditModal({ row, onClose, editBookMutation }) {
  return (
    <Modal
      opened={row ? true : false}
      onClose={onClose}
      title="Edit book"
      styles={{ title: { fontSize: "1.1rem", fontWeight: 600 } }}>
      {row && (
        <EditBookForm
          book={row.original}
          onSubmit={editBookMutation.mutate}
          onCloseModal={onClose}
        />
      )}
    </Modal>
  );
}

function ShelfSwitch({ shelf, onSetShelf }) {
  return (
    <Box pl={5}>
      <SegmentedControl
        size="sm"
        value={shelf}
        onChange={onSetShelf}
        data={[
          { label: "Active", value: "active" },
          { label: "All", value: "all" },
          { label: "Archived", value: "archived" },
        ]}
      />
    </Box>
  );
}

export default memo(BooksTable);
