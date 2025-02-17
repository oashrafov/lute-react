import { useQuery } from "@tanstack/react-query";
import { Button, Text, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import TableTopToolbar from "@common/TableTopToolbar/TableTopToolbar";
import getDefaultTableOptions from "@resources/table-options-default";
import { backupsQuery } from "@backup/api/backup";

const defaultOptions = getDefaultTableOptions();

const columns = [
  {
    accessorKey: "name",
    header: "FILE NAME",
    Cell: ({ row }) => (
      <Tooltip label="Download">
        <Button
          c="inherit"
          fw="normal"
          size="compact-sm"
          variant="subtle"
          component="a"
          href={`http://localhost:5001/backup/download/${row.original.name}`}>
          {row.original.name}
        </Button>
      </Tooltip>
    ),
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

function BackupsTable() {
  const { data } = useQuery(backupsQuery);

  const table = useMantineReactTable({
    ...defaultOptions,
    columns,
    data: data.backups,

    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,

    renderTopToolbar: () => (
      <TableTopToolbar>
        <Button
          color="green"
          size="xs"
          component={Link}
          to="http://localhost:5001/backup/backup?type=manual"
          leftSection={<IconPlus size={22} />}>
          New
        </Button>
        <Text
          component="p"
          size="sm"
          p={5}>{`Backups directory: ${data.directory}`}</Text>
      </TableTopToolbar>
    ),
  });

  return <MantineReactTable table={table} />;
}

export default BackupsTable;
