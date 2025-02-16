import { UnstyledButton } from "@mantine/core";

function LanguageCell({ language, onSetColumnFilters }) {
  function handleSetFilter() {
    onSetColumnFilters((filters) => {
      const otherFilters = filters.filter((filter) => filter.id !== "language");
      const languageFilters = filters.filter(
        (filter) => filter.id === "language"
      );
      const sameFilter = languageFilters[0]?.value === language;

      if (sameFilter) {
        return otherFilters;
      } else {
        return [...otherFilters, { id: "language", value: language }];
      }
    });
  }

  return (
    <UnstyledButton fz="sm" onClick={handleSetFilter}>
      {language}
    </UnstyledButton>
  );
}

export default LanguageCell;
