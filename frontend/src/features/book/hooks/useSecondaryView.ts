import { useBookContext } from "./useBookContext";
import { useActiveTermContext } from "../../term/hooks/useActiveTermContext";

export function useSecondaryView() {
  const { activeTerm } = useActiveTermContext();
  const { themeForm } = useBookContext();

  const isSelectionMode = activeTerm?.type === "select";

  const showTranslationPane =
    activeTerm?.data && !isSelectionMode && !themeForm.isOpen;
  const showBulkTermForm = isSelectionMode && !themeForm.isOpen;
  const showThemeForm = themeForm.isOpen;

  return showTranslationPane
    ? "translation"
    : showBulkTermForm
      ? "bulkTermForm"
      : showThemeForm
        ? "themeForm"
        : null;
}
