import { useMemo, useState, type CSSProperties } from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Modal } from "@mantine/core";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnFilterFnsState,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_TableInstance,
  type MRT_VisibilityState,
} from "mantine-react-table";
import BulkTermForm from "../BulkTermForm/BulkTermForm";
import { TopToolbar } from "./components/TopToolbar";
import { EmptyRow } from "#common/EmptyRow/EmptyRow";
import { getDefaultTableOptions } from "#resources/table-options-default";
import { columnDefinition } from "./columnDefinition";
import { queries as termQueries } from "#term/api/queries";
import type { TermsListItem } from "#term/api/types";
import { queries as settingsQueries } from "#settings/api/queries";

const defaultOptions = getDefaultTableOptions<TermsListItem>();

const PAGINATION = {
  pageIndex: 0,
  pageSize: 25,
};

const COLUMN_FILTER_FNS = {
  text: "contains",
  parentsString: "contains",
  translation: "contains",
  language: "contains",
};

const COLUMN_FILTERS = [{ id: "status", value: [0, 6] }];

export function TermsTable() {
  const { termIds } = useSearch({ strict: false });
  const { data: initial } = useSuspenseQuery(settingsQueries.init());
  const { data: termTags } = useSuspenseQuery(termQueries.tagSuggestions());
  const [editModalOpened, setEditModalOpened] = useState(false);

  const [showParentsOnly, setShowParentsOnly] = useState(false);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>(PAGINATION);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] =
    useState<MRT_ColumnFiltersState>(COLUMN_FILTERS);
  const [columnFilterFns, setColumnFilterFns] =
    useState<MRT_ColumnFilterFnsState>(COLUMN_FILTER_FNS);

  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      // tags: false,
      "createdOn": false,
      "parentsString": true,
      "mrt-row-actions": false,
    }
  );

  const columns = useMemo(
    () => columnDefinition(initial.languageChoices, termTags, setColumnFilters),
    [initial.languageChoices, termTags]
  );

  const searchParams = new URLSearchParams({
    ids: termIds ? JSON.stringify(termIds) : "[]",
    parentsOnly: showParentsOnly ? "true" : "false",
    start: `${pagination.pageIndex * pagination.pageSize}`,
    size: `${pagination.pageSize}`,
    filters: JSON.stringify(columnFilters ?? []),
    filterModes: JSON.stringify(columnFilterFns ?? {}),
    globalFilter: globalFilter ?? "",
    sorting: JSON.stringify(sorting ?? []),
  });

  const { data } = useQuery(termQueries.list(searchParams.toString()));

  const handleSaveRow = async ({
    table,
    values,
  }: {
    table: MRT_TableInstance<TermsListItem>;
    values: TermsListItem;
  }) => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
    // tableData[row.index] = values;
    // const data = {
    //   parentsString: values.parentsString,
    //   translation: values.translation,
    //   tags: values.tags,
    //   status: values.status,
    // };
    console.log(values);
    //send/receive api updates here
    table.setEditingRow(null); //exit editing mode
  };

  function handleShowParentsOnly() {
    setColumnVisibility((v) => ({
      ...v,
      parentsString: !v.parentsString,
    }));
    setShowParentsOnly((v) => !v);
  }

  const table = useMantineReactTable({
    ...defaultOptions,

    columns: columns,
    data: data?.data || [],
    rowCount: data?.filteredCount,
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

    getRowId: (originalRow) => String(originalRow.id),

    mantineTableBodyCellProps: ({ cell }) => {
      const termCell = cell.column.id === "text";
      const isRtl = cell.row.original.textDirection === "rtl";
      return {
        style: isRtl && termCell ? { textAlign: "right" } : {},
      };
    },

    mantineTableBodyRowProps: ({ row, table }) => {
      const isEditing = table.getState().editingRow?.id === row.id;
      const isSelected = row.getIsSelected();

      const style: CSSProperties = {};
      if (isSelected) style.backgroundColor = "initial";
      if (isEditing) style.verticalAlign = "top";

      return {
        style: style,
      };
    },

    renderEmptyRowsFallback: ({ table }) => {
      const language = table.getColumn("language").getFilterValue() as string;
      return language?.length > 0 ? (
        <EmptyRow tableName="terms" language={language} />
      ) : null;
    },

    renderTopToolbar: ({ table }) => (
      <TopToolbar
        table={table}
        showParentsOnly={showParentsOnly}
        onShowParentsOnly={handleShowParentsOnly}
        onSetEditModalOpened={setEditModalOpened}
        showNewTermButton={!termIds || termIds.length === 0}
      />
    ),
  });

  return (
    <>
      <MantineReactTable table={table} />
      <Modal
        trapFocus
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        styles={{ title: { fontWeight: 700 } }}
        title="Edit term(s)"
        withCloseButton>
        <BulkTermForm
          terms={table.getSelectedRowModel().rows.map((row) => row.original.id)}
        />
      </Modal>
    </>
  );
}
