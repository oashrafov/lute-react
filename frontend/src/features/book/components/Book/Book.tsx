import { usePrefetchPages } from "../../hooks/usePrefetchPages";
import { useSetupShortcuts } from "../../hooks/useSetupShortcuts";
import { DefaultView } from "../DefaultView/DefaultView";
import { EditView } from "../EditView/EditView";
import { FocusView } from "../FocusView/FocusView";
import { PageSpinner } from "../../../../components/common/PageSpinner/PageSpinner";
import { PlayerProvider } from "../common/Player/store/playerContext";
import { ActiveDictTabProvider } from "../../../language/store/activeDictTabContext";
import { useApplyInitialView } from "../../hooks/useApplyInitialView";

export function Book() {
  const viewReady = useApplyInitialView();
  usePrefetchPages();
  useSetupShortcuts();

  if (!viewReady) {
    return <PageSpinner />;
  }

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
