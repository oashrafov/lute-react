import type { Control } from "react-hook-form";
import { rem, type CheckboxProps } from "@mantine/core";
import { Checkbox } from "#common/Checkbox/Checkbox";
import type { TermDetail } from "#term/api/types";

interface SyncStatusCheckbox extends Omit<CheckboxProps, "name"> {
  control: Control<TermDetail>;
}
export function SyncStatusCheckbox({ control, ...props }: SyncStatusCheckbox) {
  return (
    <Checkbox
      name="syncStatus"
      control={control}
      label="Link to parent"
      styles={{ label: { paddingInlineStart: rem(5) } }}
      size="xs"
      {...props}
    />
  );
}
