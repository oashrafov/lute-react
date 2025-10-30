import type { Control, FieldValues, Path } from "react-hook-form";
import type { TextareaProps } from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";
import { Textarea } from "../../../../../../components/common/Textarea/Textarea";
import type { TextDirection } from "../../../../../../resources/types";
import { moveCursorToEnd } from "../../../../../../utils/utils";
import classes from "../../TermForm.module.css";
import type { RefObject } from "react";

interface TranslationField<T extends FieldValues> extends TextareaProps {
  textDirection: TextDirection;
  control: Control<T>;
  inputRef?: RefObject<HTMLTextAreaElement>;
}

export function TranslationField<T extends FieldValues>({
  control,
  inputRef,
  textDirection,
}: TranslationField<T>) {
  return (
    <Textarea
      name={"translation" as Path<T>}
      control={control}
      placeholder="Translation"
      wrapperProps={{ dir: textDirection }}
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
    />
  );
}
