import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select } from "@mantine/core";
import { IconSelector } from "@tabler/icons-react";
import { predefinedLanguagesQuery } from "@language/api/query";
import { initialQuery } from "@settings/api/settings";
import { LoadSampleBooksButton } from "./LoadSampleBooksButton";

export function SampleBooksSelect({ onSuccess, onConfirm, ...props }) {
  const { data: initial } = useQuery(initialQuery);
  const { data: predefined } = useQuery(predefinedLanguagesQuery);
  const [langName, setLangName] = useState("");

  const rightSection = langName ? (
    <LoadSampleBooksButton
      langName={langName}
      onSuccess={onSuccess}
      onConfirm={onConfirm}
    />
  ) : (
    <IconSelector size={16} />
  );

  return (
    <Select
      {...props}
      autoFocus={false}
      display="inline-block"
      data={predefined || []}
      allowDeselect={false}
      withCheckIcon={false}
      searchable={true}
      value={langName}
      onChange={setLangName}
      comboboxProps={{ withinPortal: !initial.haveLanguages }}
      rightSection={rightSection}
      rightSectionPointerEvents={langName === null ? "none" : "all"}
    />
  );
}
