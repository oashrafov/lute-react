import type { Control, FieldValues, Path } from "react-hook-form";
import type { TextareaProps } from "@mantine/core";
import { IconNote } from "@tabler/icons-react";
import { Textarea } from "#common/Textarea/Textarea";
import classes from "../../TermForm.module.css";

interface NotesField<T extends FieldValues> extends TextareaProps {
  control: Control<T>;
}

export function NotesField<T extends FieldValues>({ control }: NotesField<T>) {
  return (
    <Textarea
      name={"notes" as Path<T>}
      control={control}
      placeholder="Notes"
      resize="vertical"
      autosize
      spellCheck={false}
      autoCapitalize="off"
      minRows={3}
      leftSection={<IconNote size={20} />}
      leftSectionProps={{ className: classes.leftSection }}
      mb={5}
    />
  );
}
