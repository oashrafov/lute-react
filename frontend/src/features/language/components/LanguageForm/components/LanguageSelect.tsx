import { useState, useEffect, memo, type ChangeEvent } from "react";
import {
  useNavigate,
  useSearch,
  useRouterState,
  type ValidateFromPath,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Combobox,
  Input,
  InputBase,
  ScrollArea,
  useCombobox,
} from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";
import { queries } from "#language/api/queries";

export const LanguageSelect = memo(function LanguageSelect() {
  const { langId, langName } = useSearch({ strict: false });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate({ from: pathname as ValidateFromPath });
  const { data: languages } = useQuery(queries.predefinedLanguagesList());

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  let filteredOptions: string[];
  if (languages) {
    const shouldFilterOptions = languages.every((item) => item !== search);
    filteredOptions = shouldFilterOptions
      ? languages.filter((item) =>
          item.toLowerCase().includes(search.toLowerCase().trim())
        )
      : languages;
  } else {
    filteredOptions = [];
  }

  function handleOpenCombobox() {
    combobox.openDropdown();
  }

  function handleClearField() {
    setSearch("");
    setValue(null);
    navigate({ search: { langId: 0, langName: "" } });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    combobox.openDropdown();
    combobox.updateSelectedOptionIndex();
    setSearch(e.currentTarget.value);
  }

  function handleOnBlur() {
    combobox.closeDropdown();
    setSearch(value || "");
  }

  function handleOptionSubmit(val: string) {
    if (val === "$create") {
      setValue(search);
    } else {
      setValue(val);
      setSearch(val);
      navigate({ search: { langId: 0, langName: val } });
    }

    combobox.closeDropdown();
  }

  const inputRightSection =
    value !== null ? (
      <Input.ClearButton onClick={handleClearField} />
    ) : (
      <Combobox.Chevron />
    );

  useEffect(() => {
    const openedFromLanguages = pathname === "/languages";

    if (langName && openedFromLanguages) {
      setSearch(langName);
      setValue(langName);
    }
    if (langId !== 0) {
      setSearch("");
      setValue(null);
    }
  }, [langId, langName, pathname]);

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={handleOptionSubmit}>
      <Combobox.Target>
        <InputBase
          mb={10}
          w="fit-content"
          label="New language"
          description="Create new or from predefined"
          placeholder="e.g. Arabic"
          leftSection={<IconLanguage />}
          rightSection={inputRightSection}
          rightSectionPointerEvents={value === null ? "none" : "all"}
          value={search}
          onChange={handleChange}
          onClick={handleOpenCombobox}
          onFocus={handleOpenCombobox}
          onBlur={handleOnBlur}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize mah={400} type="scroll">
            {filteredOptions.map((item) => (
              <Combobox.Option value={item} key={item}>
                {item}
              </Combobox.Option>
            ))}
            {filteredOptions.length === 0 && search.trim().length > 0 && (
              <Combobox.Option value="$create">
                + Create {search}
              </Combobox.Option>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
});
