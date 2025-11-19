import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, type SelectProps } from "@mantine/core";
import { IconSelector } from "@tabler/icons-react";
import { LoadSampleBooksButton } from "./LoadSampleBooksButton";
import { queries as langQueries } from "#language/api/queries";
import { queries as settingsQueries } from "#settings/api/queries";

interface SampleBooksSelect extends SelectProps {
  onSuccess?: (arg: string) => void;
  onConfirm?: () => void;
}

export function SampleBooksSelect({
  onSuccess,
  onConfirm,
  ...props
}: SampleBooksSelect) {
  const { data: initial } = useQuery(settingsQueries.init());
  const { data: predefined } = useQuery(langQueries.predefinedLanguagesList());
  const [langName, setLangName] = useState<string | null>("");

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
      comboboxProps={{ withinPortal: !initial?.haveLanguages }}
      rightSection={rightSection}
      rightSectionPointerEvents={langName === null ? "none" : "all"}
    />
  );
}
