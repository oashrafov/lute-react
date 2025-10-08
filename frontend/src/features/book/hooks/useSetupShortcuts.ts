import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPressedKeysAsString } from "../../../utils/utils";
import { handleCopy } from "../../../helpers/copy";
import { handleTranslate } from "../../../helpers/translation";
import {
  incrementStatusForMarked,
  updateStatusForMarked,
} from "../../../helpers/status";
import { handleMoveCursor } from "../../../helpers/interactions-desktop";
import { handleToggleHighlights } from "../../../helpers/page";
import { useBookContext } from "./useBookContext";
import { useActiveTermContext } from "../../term/hooks/useActiveTermContext";
import { queries as settingsQueries } from "../../settings/api/queries";
import { TEXTITEM_CLASS, TEXTITEM_DATASET } from "../../../resources/constants";
import { useBookQuery } from "./useBookQuery";
import { useView } from "./useView";
import type { TextitemElement } from "../../../resources/types";

export function useSetupShortcuts() {
  const { themeForm } = useBookContext();
  const { view, setView, toggleFocus } = useView();
  const { clearActiveTerm } = useActiveTermContext();
  const { data: shortcut } = useQuery(settingsQueries.shortcuts());
  const { data: book } = useBookQuery();

  useEffect(() => {
    function ignoreKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const inEditMode = view === "edit";
      // Escape should still work even when typing
      const isTyping = target.matches("input, textarea") && e.key !== "Escape";
      return inEditMode || isTyping;
    }

    function setupKeydownEvents(e: KeyboardEvent) {
      if (ignoreKeydown(e)) return;

      let selected: TextitemElement | null;

      const next = book.textDirection === "rtl" ? -1 : 1;
      const prev = -1 * next;

      const map = {
        [shortcut.hotkey_StartHover.key]: () => {
          clearActiveTerm();
          themeForm.close();
        },

        [shortcut.hotkey_PrevWord.key]: () =>
          handleMoveCursor(`.${TEXTITEM_CLASS.word}`, prev),
        [shortcut.hotkey_NextWord.key]: () =>
          handleMoveCursor(`.${TEXTITEM_CLASS.word}`, next),
        [shortcut.hotkey_PrevUnknownWord.key]: () =>
          handleMoveCursor(`[data-${TEXTITEM_DATASET.status}="0"]`, prev),
        [shortcut.hotkey_NextUnknownWord.key]: () =>
          handleMoveCursor(`[data-${TEXTITEM_DATASET.status}="0"]`, next),
        [shortcut.hotkey_PrevSentence.key]: () =>
          handleMoveCursor(
            `[data-${TEXTITEM_DATASET.sentenceStart}="true"]`,
            prev
          ),
        [shortcut.hotkey_NextSentence.key]: () =>
          handleMoveCursor(
            `[data-${TEXTITEM_DATASET.sentenceStart}="true"]`,
            next
          ),

        [shortcut.hotkey_CopySentence.key]: () =>
          handleCopy(selected, "sentence"),
        [shortcut.hotkey_CopyPara.key]: () => handleCopy(selected, "paragraph"),
        [shortcut.hotkey_CopyPage.key]: () => handleCopy(selected),

        [shortcut.hotkey_TranslateSentence.key]: () =>
          handleTranslate("sentence"),
        [shortcut.hotkey_TranslatePara.key]: () => handleTranslate("paragraph"),
        [shortcut.hotkey_TranslatePage.key]: () => handleTranslate(null),

        [shortcut.hotkey_StatusUp.key]: () => incrementStatusForMarked(+1),
        [shortcut.hotkey_StatusDown.key]: () => incrementStatusForMarked(-1),

        [shortcut.hotkey_Status1.key]: () => updateStatusForMarked(1),
        [shortcut.hotkey_Status2.key]: () => updateStatusForMarked(2),
        [shortcut.hotkey_Status3.key]: () => updateStatusForMarked(3),
        [shortcut.hotkey_Status4.key]: () => updateStatusForMarked(4),
        [shortcut.hotkey_Status5.key]: () => updateStatusForMarked(5),
        [shortcut.hotkey_StatusIgnore.key]: () => updateStatusForMarked(98),
        [shortcut.hotkey_StatusWellKnown.key]: () => updateStatusForMarked(99),
        [shortcut.hotkey_DeleteTerm.key]: () => updateStatusForMarked(0),

        // [settings.hotkey_Bookmark.key]: () => handleAddBookmark(book),
        [shortcut.hotkey_EditPage.key]: () => {
          setView("edit");
          clearActiveTerm();
        },

        [shortcut.hotkey_NextTheme.key]: () => {
          themeForm.toggle();
          clearActiveTerm();
        },
        [shortcut.hotkey_ToggleHighlight.key]: () => handleToggleHighlights(),
        [shortcut.hotkey_ToggleFocus.key]: () => {
          toggleFocus();
        },
      };

      const key = getPressedKeysAsString(e);
      if (key in map) {
        const target = e.target as HTMLElement;
        selected = target.matches(`.${TEXTITEM_CLASS.word}`)
          ? (target as TextitemElement)
          : null;
        // Override any existing event - e.g., if "up" arrow is in the map,
        // don't scroll screen.
        e.preventDefault();
        map[key]();
      }
    }

    document.addEventListener("keydown", setupKeydownEvents);

    return () => document.removeEventListener("keydown", setupKeydownEvents);
  }, []);
}
