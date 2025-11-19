import type { Control, FieldValues, Path } from "react-hook-form";
import type { TagsInputProps } from "@mantine/core";
import { IconTags } from "@tabler/icons-react";
import { TagsInput } from "#common/TagsInput/TagsInput";
import classes from "../../TermForm.module.css";

interface TermTagsField<T extends FieldValues> extends TagsInputProps {
  control: Control<T>;
}

export function TermTagsField<T extends FieldValues>({
  control,
  ...props
}: TermTagsField<T>) {
  return (
    <TagsInput
      {...props}
      name={"termTags" as Path<T>}
      control={control}
      placeholder="Tags"
      maxDropdownHeight={200}
      leftSection={<IconTags size={20} />}
      leftSectionProps={{ className: classes.leftSection }}
      mb={5}
    />
  );
}
