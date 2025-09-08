import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPressedKeysAsString } from "../../../utils/utils";
import { handleCopy } from "../../../helpers/copy";
import { handleTranslate } from "../../../helpers/translation";
import {
  incrementStatusForMarked,
  updateStatusForMarked,
} from "../../../helpers/status";
import {
  handleMoveCursor,
  resetFocusActiveSentence,
  startHoverMode,
} from "../../../helpers/interactions-desktop";
import { handleSetView, handleToggleHighlights } from "../../../helpers/page";
import { usePageContext } from "./usePageContext";
import { useBookContext } from "./useBookContext";
import { useViewContext } from "./useViewContext";
import { useActiveTermContext } from "../../term/hooks/useActiveTermContext";
import { queries as settingsQueries } from "../../settings/api/queries";
import { TEXTITEM_CLASS, TEXTITEM_DATA } from "../../../resources/constants";
import { useBookQuery } from "./useBookQuery";

export function useSetupShortcuts() {
  const { themeForm } = useBookContext();
  const { view, setView } = useViewContext();
  const { dispatch } = usePageContext();
  const { setActiveTerm } = useActiveTermContext();
  const { data: settings } = useQuery(settingsQueries.settings());
  const { data: book } = useBookQuery();

  useEffect(() => {
    function ignoreKeydown(e) {
      const inEditMode = view === "edit";
      const isTyping =
        e.target.matches("input, textarea") && e.key !== "Escape"; // Escape shortcut should still work even when typing
      return inEditMode || isTyping;
    }

    function setupKeydownEvents(e) {
      if (ignoreKeydown(e)) return;

      let selected;

      const next = book.textDirection === "rtl" ? -1 : 1;
      const prev = -1 * next;

      // Map of shortcuts to lambdas:
      const map = {
        [settings.hotkey_StartHover]: () => {
          startHoverMode();
          setActiveTerm({ data: null });
          resetFocusActiveSentence();
          themeForm.close();
        },

        [settings.hotkey_PrevWord]: () =>
          handleMoveCursor(`.${TEXTITEM_CLASS.word}`, prev),
        [settings.hotkey_NextWord]: () =>
          handleMoveCursor(`.${TEXTITEM_CLASS.word}`, next),
        [settings.hotkey_PrevUnknownWord]: () =>
          handleMoveCursor(`[data-${TEXTITEM_DATA.status}="0"]`, prev),
        [settings.hotkey_NextUnknownWord]: () =>
          handleMoveCursor(`[data-${TEXTITEM_DATA.status}="0"]`, next),
        [settings.hotkey_PrevSentence]: () =>
          handleMoveCursor(
            `[data-${TEXTITEM_DATA.sentenceStart}="true"]`,
            prev
          ),
        [settings.hotkey_NextSentence]: () =>
          handleMoveCursor(
            `[data-${TEXTITEM_DATA.sentenceStart}="true"]`,
            next
          ),

        [settings.hotkey_CopySentence]: () => handleCopy(selected, "sentence"),
        [settings.hotkey_CopyPara]: () => handleCopy(selected, "paragraph"),
        [settings.hotkey_CopyPage]: () => handleCopy(selected),

        [settings.hotkey_TranslateSentence]: () => handleTranslate("sentence"),
        [settings.hotkey_TranslatePara]: () => handleTranslate("paragraph"),
        [settings.hotkey_TranslatePage]: () => handleTranslate(null),

        [settings.hotkey_StatusUp]: () => incrementStatusForMarked(+1),
        [settings.hotkey_StatusDown]: () => incrementStatusForMarked(-1),

        [settings.hotkey_Status1]: () => updateStatusForMarked(1),
        [settings.hotkey_Status2]: () => updateStatusForMarked(2),
        [settings.hotkey_Status3]: () => updateStatusForMarked(3),
        [settings.hotkey_Status4]: () => updateStatusForMarked(4),
        [settings.hotkey_Status5]: () => updateStatusForMarked(5),
        [settings.hotkey_StatusIgnore]: () => updateStatusForMarked(98),
        [settings.hotkey_StatusWellKnown]: () => updateStatusForMarked(99),
        [settings.hotkey_DeleteTerm]: () => updateStatusForMarked(0),

        // [settings.hotkey_Bookmark]: () => handleAddBookmark(book),
        [settings.hotkey_EditPage]: () => {
          setActiveTerm({ data: null });
          resetFocusActiveSentence();
          setView("edit");
        },

        [settings.hotkey_NextTheme]: () => {
          themeForm.toggle();
          setActiveTerm({ data: null });
          resetFocusActiveSentence();
        },
        [settings.hotkey_ToggleHighlight]: () =>
          handleToggleHighlights(dispatch),
        [settings.hotkey_ToggleFocus]: () => {
          setView((prev) => {
            const newView = prev === "focus" ? "default" : "focus";
            handleSetView(newView);
            return newView;
          });
        },
      };

      const key = getPressedKeysAsString(e);
      if (key in map) {
        selected = e.target.matches(`.${TEXTITEM_CLASS.word}`)
          ? e.target
          : null;
        // Override any existing event - e.g., if "up" arrow is in the map,
        // don't scroll screen.
        e.preventDefault();
        map[key]();
      }
    }

    document.addEventListener("keydown", setupKeydownEvents);

    return () => {
      document.removeEventListener("keydown", setupKeydownEvents);
    };
  }, []);
}
