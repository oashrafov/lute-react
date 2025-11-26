import { IconBubbleText } from "@tabler/icons-react";
import type { TextInputProps } from "@mantine/core";
import type { Control } from "react-hook-form";
import { TextInput } from "#common/TextInput/TextInput";
import type { TermDetail } from "#term/api/types";
import classes from "../../TermForm.module.css";

interface TermField extends TextInputProps {
  control: Control<TermDetail>;
}

export function TermField({ control, ...props }: TermField) {
  return (
    <TextInput
      placeholder="Term"
      flex={1}
      leftSection={<IconBubbleText size={20} />}
      leftSectionProps={{ className: classes.leftSection }}
      {...props}
      name="originalText"
      control={control}
    />
  );
}
