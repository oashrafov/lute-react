import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { ActionIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import getDefaultTableOptions from "@resources/table-options-default";

const defaultOptions = getDefaultTableOptions();

const columns = [
  {
    accessorKey: "name",
    header: "FILE NAME",
  },
  {
    accessorKey: "size",
    header: "FILE SIZE",
  },
  {
    accessorKey: "lastModified",
    header: "LAST MODIFIED",
  },
];

function BackupsTable({ data }) {
  const table = useMantineReactTable({
    ...defaultOptions,
    columns,
    data,

    mantineTableContainerProps: {
      mah: 500,
    },

    mantineTableProps: {
      ...defaultOptions.mantineTableProps,
      highlightOnHover: false,
    },

    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "DOWNLOAD",
        size: 10,
        minSize: 10,
      },
    },

    renderRowActions: ({ row }) => (
      <ActionIcon
        variant="subtle"
        component="a"
        href={`http://localhost:5001/backup/download/${row.original.name}`}>
        <IconDownload />
      </ActionIcon>
    ),

    enableRowActions: true,
    enableToolbarInternalActions: false,
    enableGlobalFilter: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
  });

  return <MantineReactTable table={table} />;
}

export default BackupsTable;
