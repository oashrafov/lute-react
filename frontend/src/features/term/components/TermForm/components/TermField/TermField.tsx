import { IconBubbleText } from "@tabler/icons-react";
import type { TextInputProps } from "@mantine/core";
import type { Control, FieldValues, Path } from "react-hook-form";
import { TextInput } from "#common/TextInput/TextInput";
import classes from "../../TermForm.module.css";

interface TermField<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
}

export function TermField<T extends FieldValues>({
  control,
  ...props
}: TermField<T>) {
  return (
    <TextInput
      control={control}
      placeholder="Term"
      flex={1}
      leftSection={<IconBubbleText size={20} />}
      leftSectionProps={{ className: classes.leftSection }}
      {...props}
      name={"originalText" as Path<T>}
    />
  );
}
