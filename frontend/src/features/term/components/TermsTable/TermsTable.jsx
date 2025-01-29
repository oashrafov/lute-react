import { memo, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Checkbox, Modal } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import ActionsMenu from "./components/ActionsMenu";
import BulkTermForm from "../BulkTermForm/BulkTermForm";
import EmptyRow from "@common/EmptyRow/EmptyRow";
import getDefaultTableOptions from "@resources/table-options-default";
import columnDefinition from "./columnDefinition";

const defaultOptions = getDefaultTableOptions();

const PAGINATION = {
  pageIndex: 0,
  pageSize: 10,
};

const COLUMN_FILTER_FNS = {
  text: "contains",
  parentText: "contains",
  translation: "contains",
  language: "contains",
};

const COLUMN_FILTERS = [{ id: "status", value: [0, 6] }];

//build the URL (start=0&size=10&filters=[]&globalFilter=&sorting=[])
const url = new URL("/api/terms", "http://localhost:5001");

function TermsTable({ languageChoices, tagChoices }) {
  const columns = useMemo(
    () => columnDefinition(languageChoices, tagChoices),
    [languageChoices, tagChoices]
  );

  const handleSaveRow = async ({ table, values }) => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
    // tableData[row.index] = values;
    // const data = {
    //   parentText: values.parentText,
    //   translation: values.translation,
    //   tags: values.tags,
    //   status: values.status,
    // };
    console.log(values);
    //send/receive api updates here
    table.setEditingRow(null); //exit editing mode
  };

  const [editModalOpened, setEditModalOpened] = useState(false);

  const [showParentsOnly, setShowParentsOnly] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState(PAGINATION);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState(COLUMN_FILTERS);
  const [columnFilterFns, setColumnFilterFns] = useState(COLUMN_FILTER_FNS);

  const [columnVisibility, setColumnVisibility] = useState({
    // tags: false,
    createdOn: false,
    parentText: true,
  });

  url.searchParams.set("parentsOnly", showParentsOnly);
  url.searchParams.set(
    "start",
    `${pagination.pageIndex * pagination.pageSize}`
  );
  url.searchParams.set("size", `${pagination.pageSize}`);
  url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
  url.searchParams.set("filterModes", JSON.stringify(columnFilterFns ?? {}));
  url.searchParams.set("globalFilter", globalFilter ?? "");
  url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

  const response = useQuery({
    queryKey: ["allTerms", url.href],
    queryFn: async () => {
      const response = await fetch(url.href);
      return await response.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const data = response.data;
  const table = useMantineReactTable({
    ...defaultOptions,

    columns: columns,
    data: data?.data || [],
    rowCount: data?.total,
    localization: {
      min: "From",
      max: "To",
    },

    initialState: {
      ...defaultOptions.initialState,
    },

    state: {
      columnFilterFns,
      columnFilters,
      globalFilter,
      pagination,
      sorting,
      columnVisibility,
    },

    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "",
      },
    },

    mantineTableBodyCellProps: {
      valign: "top",
    },

    enableRowSelection: true,
    enableColumnFilterModes: true,
    enableEditing: true,
    editDisplayMode: "row",

    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onEditingRowSave: handleSaveRow,

    getRowId: (originalRow) => originalRow.id,

    renderEmptyRowsFallback: ({ table }) => {
      const language = table.getColumn("language").getFilterValue();
      const isLanguageFiltered = language?.length > 0;
      return isLanguageFiltered ? (
        <EmptyRow
          tableName="terms"
          language={language}
          languageChoices={languageChoices}
        />
      ) : null;
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <ActionsMenu table={table} onSetEditModalOpened={setEditModalOpened} />
        <Checkbox
          checked={showParentsOnly}
          onChange={(e) => {
            setColumnVisibility((v) => ({ ...v, parentText: !v.parentText }));
            setShowParentsOnly(e.currentTarget.checked);
          }}
          label="Parent terms only"
          size="sm"
          ml="auto"
          mr="xs"
          style={{ alignSelf: "center" }}
        />
      </>
    ),
  });

  return (
    <>
      <MantineReactTable table={table} />
      <Modal
        trapFocus
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title="Edit term(s)"
        withCloseButton>
        <BulkTermForm terms={table.getSelectedRowModel().rows} />
      </Modal>
    </>
  );
}

export default memo(TermsTable);
