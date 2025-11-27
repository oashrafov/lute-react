import { useState } from "react";
import { useController, type Control } from "react-hook-form";
import { InputClearButton, Loader } from "@mantine/core";
import { IconSitemap } from "@tabler/icons-react";
import { MAX_TERM_SUGGESTIONS } from "#resources/constants";
import { TagsField } from "#common/TagsField/TagsField";
import { useParentOptionsQuery } from "./useParentOptionsQuery";
import type { TermDetail } from "#term/api/types";
import classes from "../../TermForm.module.css";

interface ParentTagsField {
  control: Control<TermDetail>;
  termText: string;
  onOptionSubmit: (parent: string) => void;
  onTagClick?: (item: string) => void;
}

export function ParentTagsField({
  termText,
  onTagClick,
  onOptionSubmit,
  control,
}: ParentTagsField) {
  const { field } = useController({ name: "parents", control });
  const [search, setSearch] = useState("");
  const { value, onChange } = field;

  const { data, isFetching } = useParentOptionsQuery(search, termText, value);

  const inputRightSection =
    value.length > 0 ? (
      <InputClearButton onClick={() => onChange([])} />
    ) : (
      isFetching && <Loader size="sm" />
    );

  return (
    <TagsField
      data={data}
      searchValue={search}
      onSearchChange={setSearch}
      rightSection={inputRightSection}
      value={value}
      onChange={onChange}
      onTagClick={onTagClick}
      onOptionSubmit={onOptionSubmit}
      limit={MAX_TERM_SUGGESTIONS}
      leftSection={<IconSitemap size={20} />}
      leftSectionProps={{ className: classes.leftSection }}
      placeholder="Parents"
      maxDropdownHeight={250}
      mb={5}
    />
  );
}
