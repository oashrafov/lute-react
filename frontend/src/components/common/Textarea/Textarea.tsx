import { Textarea as MantineTextarea, type TextareaProps } from "@mantine/core";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface Textarea<T extends FieldValues> extends TextareaProps {
  name: Path<T>;
  control: Control<T>;
}

export function Textarea<T extends FieldValues>({
  name,
  control,
  ...props
}: Textarea<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <MantineTextarea {...props} {...field} />}
    />
  );
}
