import { Group } from "@mantine/core";
import {
  MRT_GlobalFilterTextInput,
  MRT_ShowHideColumnsButton,
} from "mantine-react-table";

export function TableTopToolbarDefaultItems({ table }) {
  return (
    <Group wrap="nowrap" gap={5}>
      <MRT_GlobalFilterTextInput table={table} variant="default" mx={0} />
      <MRT_ShowHideColumnsButton table={table} size="input-xs" />
    </Group>
  );
}
