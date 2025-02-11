function createTagsFieldHandlers(
  languageId,
  onSetActiveTerm,
  values,
  onSetValues,
  onSubmitParent,
  combobox,
  search,
  setSearch
) {
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
    combobox.updateSelectedOptionIndex();
    setSearch(val);
  }

  function handleTagClick(item) {
    languageId &&
      onSetActiveTerm({
        data: item,
        langID: languageId,
        type: "multi",
      });
  }

  function handleOptionSubmit(val) {
    onSubmitParent(val);
    setSearch("");
    combobox.closeDropdown();
  }

  function handleOnBlur(event) {
    handleValueAdd(event.currentTarget.value);
    combobox.closeDropdown();
    setSearch("");
  }

  return {
    handleKeydown,
    handleInputChange,
    handleTagClick,
    handleOptionSubmit,
    handleOnBlur,
    handleValueRemove,
  };
}

export { createTagsFieldHandlers };
