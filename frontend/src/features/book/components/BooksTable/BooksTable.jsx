import { memo, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Box, Modal } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import EmptyRow from "@common/EmptyRow/EmptyRow";
import EditBookForm from "../EditBookForm/EditBookForm";
import ShelfSwitch from "./components/ShelfSwitch";
import BookActions from "./components/BookActions";
import TableTopToolbar from "@common/TableTopToolbar/TableTopToolbar";
import TableTopToolbarDefaultItems from "@common/TableTopToolbarDefaultItems/TableTopToolbarDefaultItems";
import getDefaultTableOptions from "@resources/table-options-default";
import columnDefinition from "./columnDefinition";
import { initialQuery } from "@settings/api/settings";
import { DEFAULT_TABLE_ROW_COUNT } from "@resources/constants";

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

//build the URL (start=0&size=10&filters=[]&globalFilter=&sorting=[])
const fetchURL = new URL("/api/books", "http://localhost:5001");

function BooksTable() {
  const { data: initial } = useQuery(initialQuery);
  const [editedRow, setEditedRow] = useState(null);

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

  const { data: books } = useQuery({
    queryKey: ["books", fetchURL.href],
    queryFn: async () => {
      const response = await fetch(fetchURL.href);
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
    },

    enableColumnFilterModes: true,

    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

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
