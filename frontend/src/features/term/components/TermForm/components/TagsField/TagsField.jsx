import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PillsInput,
  Pill,
  Combobox,
  useCombobox,
  Text,
  Loader,
  ScrollArea,
  Input,
} from "@mantine/core";
import { getTermSuggestionsQuery } from "@term/api/query";
import { buildSuggestionsList } from "@actions/utils";
import { MAX_PARENT_TAG_SUGGESTION_COUNT } from "@resources/constants";
import { useActiveTermContext } from "@book/hooks/useActiveTermContext";

function TagsField({
  termText,
  languageId,
  values,
  onSetValues,
  onSubmitParent,
  leftSection,
  leftSectionProps,
  mb,
}) {
  const { setActiveTerm } = useActiveTermContext();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });
  const [search, setSearch] = useState("");
  const { data, isFetching } = useQuery(
    getTermSuggestionsQuery(search, languageId)
  );

  const suggestions = data ? buildSuggestionsList(termText, data) : [];

  const options = suggestions
    .slice(0, MAX_PARENT_TAG_SUGGESTION_COUNT)
    .filter((item) =>
      item.suggestion.toLowerCase().includes(search.trim().toLowerCase())
    )
    .filter((item) => !values.includes(item.value));

  const inputRightSection = values.length ? (
    <Input.ClearButton onClick={() => onSetValues([])} />
  ) : (
    isFetching && <Loader size="sm" />
  );

  function handleValueAdd(val) {
    if (val && val !== " " && !values.includes(val)) {
      onSetValues([...values, val]);
    }
  }

  function handleValueRemove(val) {
    const newValues = values.filter((v) => v !== val);
    onSetValues(newValues);
  }

  function handleKeydown(event) {
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

  function handleInputChange(event) {
    const val = event.currentTarget.value;
    val ? combobox.openDropdown() : combobox.closeDropdown();
    setSearch(val);
    combobox.updateSelectedOptionIndex();
  }

  function handleTagClick(item) {
    if (languageId) {
      setActiveTerm({
        data: item,
        langID: languageId,
        type: "multi",
      });
    }
  }

  function handleOptionSubmit(val) {
    onSubmitParent(val);
    setSearch("");
    combobox.closeDropdown();
  }

  function handleOnBlur(event) {
    handleValueAdd(event.currentTarget.value);
    setSearch("");
    combobox.closeDropdown();
  }

  return (
    <Combobox offset={0} store={combobox} onOptionSubmit={handleOptionSubmit}>
      <Combobox.DropdownTarget>
        <PillsInput
          mb={mb}
          leftSection={leftSection}
          leftSectionProps={leftSectionProps}
          rightSection={inputRightSection}>
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
                placeholder="Parents"
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
          {suggestions.length > MAX_PARENT_TAG_SUGGESTION_COUNT && (
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

export default TagsField;
