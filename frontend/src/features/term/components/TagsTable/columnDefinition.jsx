import EditButtonsCell from "@common/EditButtonsCell/EditButtonsCell";

const columnDefinition = () => [
  {
    accessorKey: "text",
    header: "TAG",
  },
  {
    accessorKey: "comment",
    header: "COMMENT",
  },
  {
    accessorKey: "termCount",
    header: "TERM COUNT",
    columnFilterModeOptions: false,
    enableEditing: false,
  },
  {
    id: "actions",
    header: "",
    columnDefType: "display",
    size: "min-content",
    Cell: ({ row, table }) => {
      const isEditing = table.getState().editingRow?.id === row.id;
      return <EditButtonsCell row={row} table={table} isEditing={isEditing} />;
    },
  },
];

export default columnDefinition;
