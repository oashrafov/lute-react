import type { Control } from "react-hook-form";
import type { TextInputProps } from "@mantine/core";
import { IconSpeakerphone } from "@tabler/icons-react";
import { TextInput } from "#common/TextInput/TextInput";
import type { TermDetail } from "#term/api/types";
import classes from "../../TermForm.module.css";

interface PronunciationField extends Omit<TextInputProps, "name"> {
  control: Control<TermDetail>;
}

export function PronunciationField({ control, ...props }: PronunciationField) {
  return (
    <TextInput
      name="romanization"
      control={control}
      placeholder="Pronunciation"
      leftSection={<IconSpeakerphone size={20} />}
      leftSectionProps={{ className: classes.leftSection }}
      mb={5}
      {...props}
    />
  );
}
