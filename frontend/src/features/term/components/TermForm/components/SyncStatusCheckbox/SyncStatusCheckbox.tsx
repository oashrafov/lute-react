import type { Control, FieldValues, Path } from "react-hook-form";
import { rem, type CheckboxProps } from "@mantine/core";
import { Checkbox } from "#common/Checkbox/Checkbox";

interface SyncStatusCheckbox<T extends FieldValues> extends CheckboxProps {
  control: Control<T>;
}
export function SyncStatusCheckbox<T extends FieldValues>({
  control,
  ...props
}: SyncStatusCheckbox<T>) {
  return (
    <Checkbox
      {...props}
      name={"syncStatus" as Path<T>}
      control={control}
      label="Link to parent"
      styles={{ label: { paddingInlineStart: rem(5) } }}
      size="xs"
    />
  );
}
