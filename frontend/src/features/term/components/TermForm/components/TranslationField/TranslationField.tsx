import type { RefObject } from "react";
import type { Control } from "react-hook-form";
import type { TextareaProps } from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";
import { Textarea } from "#common/Textarea/Textarea";
import type { TermDetail } from "#term/api/types";
import { moveCursorToEnd } from "#utils/utils";
import classes from "../../TermForm.module.css";

interface TranslationField extends TextareaProps {
  control: Control<TermDetail>;
  inputRef?: RefObject<HTMLTextAreaElement>;
}

export function TranslationField({
  control,
  inputRef,
  ...props
}: TranslationField) {
  return (
    <Textarea
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
      name="translation"
      control={control}
    />
  );
}
