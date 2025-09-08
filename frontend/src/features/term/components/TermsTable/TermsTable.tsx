import { useMemo, useState, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Group, Modal } from "@mantine/core";
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
import { IconPlus } from "@tabler/icons-react";
import { TermActions } from "./components/TermActions";
import BulkTermForm from "../BulkTermForm/BulkTermForm";
import { ShowParentsOnlyChip } from "./components/ShowParentsOnlyChip";
import { EmptyRow } from "../../../../components/common/EmptyRow/EmptyRow";
import { TableTopToolbarDefaultItems } from "../../../../components/common/TableTopToolbarDefaultItems/TableTopToolbarDefaultItems";
import { TableTopToolbar } from "../../../../components/common/TableTopToolbar/TableTopToolbar";
import { getDefaultTableOptions } from "../../../../resources/table-options-default";
import { columnDefinition } from "./columnDefinition";
import { queries as termQueries } from "../../api/queries";
import { queries as settingsQueries } from "../../../settings/api/queries";
import type { TermsListItem } from "../../api/types";

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
  const [params] = useSearchParams();
  const termIds = params.get("ids");

  const { data: initial } = useQuery(settingsQueries.init());
  const { data: termTags } = useQuery(termQueries.tagSuggestions());
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
    ids: termIds ?? "[]",
    parentsOnly: showParentsOnly ? "true" : "false",
    start: `${pagination.pageIndex * pagination.pageSize}`,
    size: `${pagination.pageSize}`,
    filters: JSON.stringify(columnFilters ?? []),
    filterModes: JSON.stringify(columnFilterFns ?? {}),
    globalFilter: globalFilter ?? "",
    sorting: JSON.stringify(sorting ?? []),
  });

  const response = useQuery(termQueries.list(searchParams.toString()));

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

  const data = response.data;
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
      const language = table.getColumn("language").getFilterValue();
      const isLanguageFiltered = language?.length > 0;
      return isLanguageFiltered ? (
        <EmptyRow tableName="terms" language={language} />
      ) : null;
    },

    renderTopToolbar: ({ table }) => (
      <TableTopToolbar>
        <Group gap={5} wrap="nowrap">
          {!termIds && (
            <Button
              color="green"
              size="xs"
              component={Link}
              to="/terms/term"
              leftSection={<IconPlus size={22} />}>
              New
            </Button>
          )}
          <TermActions
            table={table}
            onSetEditModalOpened={setEditModalOpened}
          />
        </Group>
        <Group wrap="nowrap">
          <ShowParentsOnlyChip
            show={showParentsOnly}
            onShow={setShowParentsOnly}
            onSetColumnVisibility={setColumnVisibility}
          />
          <TableTopToolbarDefaultItems table={table} />
        </Group>
      </TableTopToolbar>
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
