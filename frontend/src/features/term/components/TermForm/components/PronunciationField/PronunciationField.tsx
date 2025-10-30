import type { Control, FieldValues, Path } from "react-hook-form";
import type { TextInputProps } from "@mantine/core";
import { IconSpeakerphone } from "@tabler/icons-react";
import { TextInput } from "../../../../../../components/common/TextInput/TextInput";
import classes from "../../TermForm.module.css";

interface PronunciationField<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
}

export function PronunciationField<T extends FieldValues>({
  control,
}: PronunciationField<T>) {
  return (
    <TextInput
      name={"romanization" as Path<T>}
      control={control}
      placeholder="Pronunciation"
      leftSection={<IconSpeakerphone size={20} />}
      leftSectionProps={{ className: classes.leftSection }}
      mb={5}
    />
  );
}
