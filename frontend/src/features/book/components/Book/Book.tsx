import { useEffect } from "react";
import { usePrefetchPages } from "../../hooks/usePrefetchPages";
import {
  resetFocusActiveSentence,
  startHoverMode,
} from "../../../../helpers/interactions-desktop";
import { useSetupShortcuts } from "../../hooks/useSetupShortcuts";
import { DefaultView } from "../DefaultView/DefaultView";
import { EditView } from "../EditView/EditView";
import { FocusView } from "../FocusView/FocusView";
import { useActiveTermContext } from "../../../term/hooks/useActiveTermContext";
import { PlayerProvider } from "../common/Player/store/playerContext";
import { ActiveDictTabProvider } from "../../../language/store/activeDictTabContext";

export function Book() {
  const { activeTerm } = useActiveTermContext();

  usePrefetchPages();
  useSetupShortcuts();

  useEffect(() => {
    if (!activeTerm?.data) {
      resetFocusActiveSentence();
      startHoverMode();
    }
  }, [activeTerm]);

  return (
    <>
      <PlayerProvider>
        <ActiveDictTabProvider>
          <DefaultView />
          <FocusView />
        </ActiveDictTabProvider>
      </PlayerProvider>
      <EditView />
    </>
  );
}
