import { useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { InputClearButton, Loader } from "@mantine/core";
import { IconSitemap } from "@tabler/icons-react";
import { MAX_TERM_SUGGESTIONS } from "#resources/constants";
import { buildSuggestionsList } from "#helpers/term";
import { query } from "#term/api/query";
import { TagsField } from "#common/TagsField/TagsField";
import classes from "../../TermForm.module.css";

interface ParentTagsField {
  termText: string;
  value: string[];
  onChange: (values: string[]) => void;
  onOptionSubmit: (parent: string) => void;
  onTagClick?: (item: string) => void;
}

export function ParentTagsField({
  termText,
  value,
  onChange,
  onTagClick,
  onOptionSubmit,
}: ParentTagsField) {
  const { langId } = useSearch({ strict: false });
  const [search, setSearch] = useState("");
  const { data, isFetching } = useQuery(query.termSuggestions(search, langId));

  const suggestions = data
    ? buildSuggestionsList(data.filter((d) => d.text !== termText))
    : [];

  const options = suggestions
    .slice(0, MAX_TERM_SUGGESTIONS)
    .filter((item) =>
      item.suggestion.toLowerCase().includes(search.trim().toLowerCase())
    )
    .filter((item) => !value.includes(item.value))
    .map((item) => JSON.stringify({ ...item, option: item.suggestion }));

  const inputRightSection = value.length ? (
    <InputClearButton onClick={() => onChange([])} />
  ) : (
    isFetching && <Loader size="sm" />
  );

  return (
    <TagsField
      data={options}
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
