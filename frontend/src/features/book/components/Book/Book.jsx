import { useEffect } from "react";
import { EditView } from "../EditView/EditView";
import { FocusView } from "../FocusView/FocusView";
import { usePrefetchPages } from "@book/hooks/usePrefetchPages";
import {
  resetFocusActiveSentence,
  startHoverMode,
} from "@actions/interactions-desktop";
import { useBook } from "@book/hooks/useBook";
import { useSetupShortcuts } from "@book/hooks/useSetupShortcuts";
import { DefaultView } from "../DefaultView/DefaultView";
import { useActiveTermContext } from "@book/hooks/useActiveTermContext";
import { useViewContext } from "@book/hooks/useViewContext";
import { PlayerProvider } from "../common/Player/store/playerContext";

export function Book() {
  const { activeTerm } = useActiveTermContext();
  const { book } = useBook();
  const { view } = useViewContext();

  const isDefaultMode = view === "default";
  const isFocusMode = view === "focus";
  const isEditMode = view === "edit";

  usePrefetchPages(book.pageCount);
  useSetupShortcuts();

  useEffect(() => {
    if (!activeTerm.data) {
      resetFocusActiveSentence();
      startHoverMode();
    }
  }, [activeTerm.data]);

  return (
    <>
      <PlayerProvider>
        <DefaultView show={isDefaultMode} />
        <FocusView show={isFocusMode} />
      </PlayerProvider>
      <EditView show={isEditMode} />
    </>
  );
}
