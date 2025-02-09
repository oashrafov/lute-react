import { SegmentedControl } from "@mantine/core";

function ShelfSwitch({ shelf, onSetShelf, showActiveOnly }) {
  return (
    <SegmentedControl
      size="sm"
      value={shelf}
      onChange={onSetShelf}
      data={[
        { label: "Active", value: "active" },
        {
          label: "All",
          value: "all",
          disabled: showActiveOnly,
        },
        {
          label: "Archived",
          value: "archived",
          disabled: showActiveOnly,
        },
      ]}
    />
  );
}

export default ShelfSwitch;
