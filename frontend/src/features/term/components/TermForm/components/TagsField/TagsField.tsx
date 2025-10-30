import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PillsInput,
  Pill,
  Combobox,
  useCombobox,
  Text,
  Loader,
  ScrollArea,
  InputClearButton,
  type PillsInputProps,
} from "@mantine/core";
import { MAX_TERM_SUGGESTIONS } from "../../../../../../resources/constants";
import { buildSuggestionsList } from "../../../../../../helpers/term";
import { queries } from "../../../../api/queries";

interface TagsField extends PillsInputProps {
  termText: string;
  languageId: number;
  values: string[];
  placeholder?: string;
  onSetValues: (values: string[]) => void;
  onOptionSubmit: (parent: string) => void;
  onTagClick?: (item: string) => void;
}

export function TagsField({
  termText,
  languageId,
  values,
  placeholder,
  onSetValues,
  onOptionSubmit,
  onTagClick,
  ...pillsInputProps
}: TagsField) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });
  const [search, setSearch] = useState("");
  const { data, isFetching } = useQuery(
    queries.termSuggestions(search, languageId)
  );

  const suggestions = data
    ? buildSuggestionsList(data.filter((d) => d.text !== termText))
    : [];

  const options = suggestions
    .slice(0, MAX_TERM_SUGGESTIONS)
    .filter((item) =>
      item.suggestion.toLowerCase().includes(search.trim().toLowerCase())
    )
    .filter((item) => !values.includes(item.value));

  const inputRightSection = values.length ? (
    <InputClearButton onClick={handleClearValues} />
  ) : (
    isFetching && <Loader size="sm" />
  );

  function handleValueAdd(val: string) {
    if (val && val !== " " && !values.includes(val)) {
      onSetValues([...values, val]);
    }
  }

  function handleValueRemove(val: string) {
    const newValues = values.filter((v) => v !== val);
    onSetValues(newValues);
  }

  function handleClearValues() {
    onSetValues([]);
  }

  function handleKeydown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && search.length === 0) {
      event.preventDefault();
      handleValueRemove(values[values.length - 1]);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      // alert(combobox.getSelectedOptionIndex());
      if (combobox.getSelectedOptionIndex() === -1) {
        handleValueAdd(event.currentTarget.value);
        combobox.closeDropdown();
      } else {
        // handleValueAdd(event.currentTarget.value);
      }
      setSearch("");
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const val = event.currentTarget.value;
    if (val) {
      combobox.openDropdown();
    } else {
      combobox.closeDropdown();
    }
    setSearch(val);
    combobox.updateSelectedOptionIndex();
  }

  function handleTagClick(item: string) {
    onTagClick?.(item);
  }

  function handleOptionSubmit(val: string) {
    onOptionSubmit(val);
    setSearch("");
    combobox.closeDropdown();
  }

  function handleOnBlur(event: FocusEvent<HTMLInputElement>) {
    handleValueAdd(event.currentTarget.value);
    setSearch("");
    combobox.closeDropdown();
  }

  return (
    <Combobox offset={0} store={combobox} onOptionSubmit={handleOptionSubmit}>
      <Combobox.DropdownTarget>
        <PillsInput {...pillsInputProps} rightSection={inputRightSection}>
          <Pill.Group gap={4}>
            {values.map((item) => (
              <Pill
                key={item}
                style={{ cursor: "pointer" }}
                withRemoveButton
                onClick={() => handleTagClick(item)}
                onRemove={() => handleValueRemove(item)}>
                {item}
              </Pill>
            ))}
            <Combobox.EventsTarget>
              <PillsInput.Field
                value={decodeURIComponent(search)}
                placeholder={placeholder}
                onChange={handleInputChange}
                onKeyDown={handleKeydown}
                onBlur={handleOnBlur}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      {suggestions && options.length > 0 && (
        <Combobox.Dropdown tabIndex={0}>
          <Combobox.Options>
            <ScrollArea.Autosize mah={250} type="scroll">
              {options.map((item) => (
                <Combobox.Option
                  value={JSON.stringify(item)}
                  key={item.suggestion}
                  active={values.includes(item.suggestion)}>
                  <span>{item.suggestion}</span>
                </Combobox.Option>
              ))}
            </ScrollArea.Autosize>
          </Combobox.Options>
          {suggestions.length > MAX_TERM_SUGGESTIONS && (
            <Combobox.Footer>
              <Text c="dimmed" size="xs" fs="italic">
                (more items available, please refine your search.)
              </Text>
            </Combobox.Footer>
          )}
        </Combobox.Dropdown>
      )}
    </Combobox>
  );
}
