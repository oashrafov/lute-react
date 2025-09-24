import { useEffect, type KeyboardEvent } from "react";
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
import { TEXTITEM_CLASS, TEXTITEM_DATASET } from "../../../resources/constants";
import { useBookQuery } from "./useBookQuery";
import type { TextitemElement } from "../../../resources/types";

export function useSetupShortcuts() {
  const { themeForm } = useBookContext();
  const { view, setView } = useViewContext();
  const { dispatch } = usePageContext();
  const { setActiveTerm } = useActiveTermContext();
  const { data: settings } = useQuery(settingsQueries.shortcuts());
  const { data: book } = useBookQuery();

  useEffect(() => {
    function ignoreKeydown(e: KeyboardEvent) {
      const inEditMode = view === "edit";
      const isTyping =
        e.target.matches("input, textarea") && e.key !== "Escape"; // Escape shortcut should still work even when typing
      return inEditMode || isTyping;
    }

    function setupKeydownEvents(e) {
      if (ignoreKeydown(e)) return;

      let selected: TextitemElement;

      const next = book.textDirection === "rtl" ? -1 : 1;
      const prev = -1 * next;

      // Map of shortcuts to lambdas:
      const map = {
        [settings.hotkey_StartHover.key]: () => {
          startHoverMode();
          setActiveTerm({ data: null });
          resetFocusActiveSentence();
          themeForm.close();
        },

        [settings.hotkey_PrevWord.key]: () =>
          handleMoveCursor(`.${TEXTITEM_CLASS.word}`, prev),
        [settings.hotkey_NextWord.key]: () =>
          handleMoveCursor(`.${TEXTITEM_CLASS.word}`, next),
        [settings.hotkey_PrevUnknownWord.key]: () =>
          handleMoveCursor(`[data-${TEXTITEM_DATASET.status}="0"]`, prev),
        [settings.hotkey_NextUnknownWord.key]: () =>
          handleMoveCursor(`[data-${TEXTITEM_DATASET.status}="0"]`, next),
        [settings.hotkey_PrevSentence.key]: () =>
          handleMoveCursor(
            `[data-${TEXTITEM_DATASET.sentenceStart}="true"]`,
            prev
          ),
        [settings.hotkey_NextSentence.key]: () =>
          handleMoveCursor(
            `[data-${TEXTITEM_DATASET.sentenceStart}="true"]`,
            next
          ),

        [settings.hotkey_CopySentence.key]: () =>
          handleCopy(selected, "sentence"),
        [settings.hotkey_CopyPara.key]: () => handleCopy(selected, "paragraph"),
        [settings.hotkey_CopyPage.key]: () => handleCopy(selected),

        [settings.hotkey_TranslateSentence.key]: () =>
          handleTranslate("sentence"),
        [settings.hotkey_TranslatePara.key]: () => handleTranslate("paragraph"),
        [settings.hotkey_TranslatePage.key]: () => handleTranslate(null),

        [settings.hotkey_StatusUp.key]: () => incrementStatusForMarked(+1),
        [settings.hotkey_StatusDown.key]: () => incrementStatusForMarked(-1),

        [settings.hotkey_Status1.key]: () => updateStatusForMarked(1),
        [settings.hotkey_Status2.key]: () => updateStatusForMarked(2),
        [settings.hotkey_Status3.key]: () => updateStatusForMarked(3),
        [settings.hotkey_Status4.key]: () => updateStatusForMarked(4),
        [settings.hotkey_Status5.key]: () => updateStatusForMarked(5),
        [settings.hotkey_StatusIgnore.key]: () => updateStatusForMarked(98),
        [settings.hotkey_StatusWellKnown.key]: () => updateStatusForMarked(99),
        [settings.hotkey_DeleteTerm.key]: () => updateStatusForMarked(0),

        // [settings.hotkey_Bookmark.key]: () => handleAddBookmark(book),
        [settings.hotkey_EditPage.key]: () => {
          setActiveTerm({ data: null });
          resetFocusActiveSentence();
          setView("edit");
        },

        [settings.hotkey_NextTheme.key]: () => {
          themeForm.toggle();
          setActiveTerm({ data: null });
          resetFocusActiveSentence();
        },
        [settings.hotkey_ToggleHighlight.key]: () =>
          handleToggleHighlights(dispatch),
        [settings.hotkey_ToggleFocus.key]: () => {
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
