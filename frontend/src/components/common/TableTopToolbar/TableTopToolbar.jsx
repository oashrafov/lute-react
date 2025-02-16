import { Group } from "@mantine/core";

function TableTopToolbar({ children }) {
  return (
    <Group justify="space-between" wrap="nowrap" mb={16}>
      {children}
    </Group>
  );
}

export default TableTopToolbar;
