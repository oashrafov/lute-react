import { useBookContext } from "./useBookContext";
import { useViewContext } from "./useViewContext";
import { useActiveTermContext } from "./useActiveTermContext";

export function useBookPanel(term) {
  const { activeTerm } = useActiveTermContext();
  const { themeForm } = useBookContext();
  const { view } = useViewContext();

  const isSelectionMode = activeTerm.type === "shift";

  const showTranslationPane =
    activeTerm.data && !isSelectionMode && term && !themeForm.isOpen;
  const showBulkTermForm = isSelectionMode && !themeForm.isOpen;
  const showThemeForm = themeForm.isOpen && view !== "edit";

  const secondaryView = showTranslationPane
    ? "translation"
    : showBulkTermForm
      ? "bulkTermForm"
      : showThemeForm && "themeForm";

  return { view, secondaryView };
}
