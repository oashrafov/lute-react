import { memo, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Box, Modal } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconPin, IconPinnedOff } from "@tabler/icons-react";
import EmptyRow from "@common/EmptyRow/EmptyRow";
import EditBookForm from "../EditBookForm/EditBookForm";
import ShelfSwitch from "./components/ShelfSwitch";
import { BookActions } from "./components/BookActions";
import TableTopToolbar from "@common/TableTopToolbar/TableTopToolbar";
import { TableTopToolbarDefaultItems } from "@common/TableTopToolbarDefaultItems/TableTopToolbarDefaultItems";
import getDefaultTableOptions from "@resources/table-options-default";
import columnDefinition from "./columnDefinition";
import { initialQuery } from "@settings/api/settings";
import { getFromLocalStorage } from "@actions/utils";
import { DEFAULT_TABLE_ROW_COUNT } from "@resources/constants";

const icons = {
  IconPinned: () => <IconPin />,
  IconX: () => <IconPinnedOff />,
};

const defaultOptions = getDefaultTableOptions();

const PAGINATION = {
  pageIndex: 0,
  pageSize: DEFAULT_TABLE_ROW_COUNT,
};

const COLUMN_FILTER_FNS = {
  title: "contains",
  language: "contains",
  wordCount: "greaterThan",
  status: "greaterThan",
};

const ROW_PINNING = { top: [], bottom: [] };

// start=0&size=10&filters=[]&globalFilter=&sorting=[]
const url = new URL("/api/books", "http://localhost:5001");

function BooksTable() {
  const { data: initial } = useQuery(initialQuery);
  const [editedRow, setEditedRow] = useState(null);
  const [rowPinning, setRowPinning] = useState(() =>
    getFromLocalStorage("Lute.booksTable.pinnedRows", ROW_PINNING)
  );

  function handleRowPinning(updater) {
    setRowPinning((prev) => {
      const res = updater(prev);
      localStorage.setItem("Lute.booksTable.pinnedRows", JSON.stringify(res));
      return res;
    });
  }

  const [shelf, setShelf] = useState("active");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState(PAGINATION);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnFilterFns, setColumnFilterFns] = useState(COLUMN_FILTER_FNS);

  const columns = useMemo(
    () =>
      columnDefinition(
        initial.languageChoices,
        initial.bookTags,
        setColumnFilters,
        setEditedRow,
        setShelf
      ),
    [initial.languageChoices, initial.bookTags]
  );

  url.searchParams.set("shelf", shelf);
  url.searchParams.set("pinned", JSON.stringify(rowPinning));
  url.searchParams.set(
    "start",
    `${pagination.pageIndex * pagination.pageSize}`
  );
  url.searchParams.set("size", `${pagination.pageSize}`);
  url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
  url.searchParams.set("filterModes", JSON.stringify(columnFilterFns ?? {}));
  url.searchParams.set("globalFilter", globalFilter ?? "");
  url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

  const { data: books } = useQuery({
    queryKey: ["books", url.href],
    queryFn: async () => {
      const response = await fetch(url.href);
      return await response.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const table = useMantineReactTable({
    ...defaultOptions,

    columns: columns,
    data: books?.data || [],
    rowCount: books?.filteredCount,

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
      rowPinning,
    },

    icons,

    enableColumnFilterModes: true,
    enableRowPinning: true,
    rowPinningDisplayMode: "top",

    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowPinningChange: handleRowPinning,

    getRowId: (row) => row.id,

    renderEmptyRowsFallback: ({ table }) => {
      const language = table.getColumn("language").getFilterValue();
      const isLanguageFiltered = language?.length > 0;
      return isLanguageFiltered ? (
        <EmptyRow tableName="books" language={language} />
      ) : null;
    },

    renderBottomToolbarCustomActions: () => (
      <Box pl={5}>
        <ShelfSwitch
          shelf={shelf}
          onSetShelf={setShelf}
          showActiveOnly={books.archivedCount === 0 ? true : false}
        />
      </Box>
    ),

    renderTopToolbar: ({ table }) => (
      <TableTopToolbar table={table}>
        <BookActions table={table} />
        <TableTopToolbarDefaultItems table={table} />
      </TableTopToolbar>
    ),
  });

  if (!books) return;

  return (
    <>
      <MantineReactTable table={table} />
      <Modal
        opened={editedRow}
        onClose={() => setEditedRow(null)}
        title="Edit book"
        styles={{ title: { fontSize: "1.1rem", fontWeight: 600 } }}>
        {editedRow && (
          <EditBookForm
            book={editedRow.original}
            onCloseModal={() => setEditedRow(null)}
          />
        )}
      </Modal>
    </>
  );
}

export default memo(BooksTable);
