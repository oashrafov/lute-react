// just an object instead of factory function results in weird bugs
// e.g actions column appears first, or flashes in the first column briefly
const getDefaultTableOptions = () => ({
  initialState: {
    density: "xs",
    showGlobalFilter: true,
    showColumnFilters: true,
  },

  paginationDisplayMode: "pages",
  positionToolbarAlertBanner: "bottom",
  positionActionsColumn: "last",
  enableStickyHeader: true,
  enableDensityToggle: false,
  enableFullScreenToggle: false,
  enableColumnActions: false,

  displayColumnDefOptions: {
    "mrt-row-select": {
      size: "min-content",
      grow: false,
    },
  },

  mantineSearchTextInputProps: {
    w: 200,
    size: "xs",
    leftSectionProps: {
      style: {
        padding: "5px",
      },
    },
  },

  mantineTableHeadProps: {
    style: { opacity: 1 },
  },

  mantineTableHeadRowProps: {
    style: { backgroundColor: "var(--mantine-color-body)" },
  },

  mantineCopyButtonProps: {
    display: "block",
  },

  mantineSelectAllCheckboxProps: {
    size: "sm",
  },

  mantineSelectCheckboxProps: {
    size: "sm",
  },

  mantinePaperProps: {
    withBorder: false,
    shadow: false,
    style: { "--mrt-base-background-color": "initial" }, // fixes borders not visible bug in firefox
  },

  mantineTableContainerProps: {
    mah: 600,
  },

  mantineTableProps: {
    verticalSpacing: 4,
    withColumnBorders: true,
    highlightOnHover: false,
  },

  mantinePaginationProps: {
    styles: {
      control: { width: "36px", height: "36px" },
    },
  },

  mantineFilterTextInputProps: {
    size: "xs",
  },

  mantineFilterSelectProps: {
    size: "xs",
  },

  mantineFilterDateInputProps: {
    size: "xs",
    miw: 100,
    styles: { input: { height: "var(--input-height-xs)" } },
  },
});

export default getDefaultTableOptions;
