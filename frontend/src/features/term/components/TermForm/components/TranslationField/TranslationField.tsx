import type { RefObject } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { TextareaProps } from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";
import { Textarea } from "#common/Textarea/Textarea";
import { moveCursorToEnd } from "#utils/utils";
import classes from "../../TermForm.module.css";

interface TranslationField<T extends FieldValues> extends TextareaProps {
  control: Control<T>;
  inputRef?: RefObject<HTMLTextAreaElement>;
}

export function TranslationField<T extends FieldValues>({
  control,
  inputRef,
  ...props
}: TranslationField<T>) {
  return (
    <Textarea
      control={control}
      placeholder="Translation"
      resize="vertical"
      flex={1}
      inputRef={inputRef}
      onFocusCapture={moveCursorToEnd}
      minRows={2}
      autosize
      spellCheck={false}
      autoCapitalize="off"
      autoFocus
      leftSection={<IconLanguage size={20} />}
      leftSectionProps={{ className: classes.leftSection }}
      {...props}
      name={"translation" as Path<T>}
    />
  );
}
