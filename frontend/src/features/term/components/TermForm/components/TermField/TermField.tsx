import { IconBubbleText } from "@tabler/icons-react";
import type { TextInputProps } from "@mantine/core";
import type { Control, FieldValues, Path } from "react-hook-form";
import { TextInput } from "#common/TextInput/TextInput";
import type { TextDirection } from "#resources/types";
import classes from "../../TermForm.module.css";

interface TermField<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  textDirection: TextDirection;
}

export function TermField<T extends FieldValues>({
  control,
  textDirection,
  ...props
}: TermField<T>) {
  return (
    <TextInput
      {...props}
      name={"text" as Path<T>}
      control={control}
      placeholder="Term"
      wrapperProps={{ dir: textDirection }}
      flex={1}
      leftSection={<IconBubbleText size={20} />}
      leftSectionProps={{ className: classes.leftSection }}
    />
  );
}
