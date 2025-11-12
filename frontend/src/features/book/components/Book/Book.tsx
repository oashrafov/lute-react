import { usePrefetchPages } from "../../hooks/usePrefetchPages";
import { useSetupShortcuts } from "../../hooks/useSetupShortcuts";
import { DefaultView } from "../DefaultView/DefaultView";
import { EditView } from "../EditView/EditView";
import { FocusView } from "../FocusView/FocusView";
import { PlayerProvider } from "../common/Player/store/playerContext";
import { AudioDataProvider } from "../common/Player/store/audioDataContext";
import { useApplyInitialView } from "../../hooks/useApplyInitialView";

export function Book() {
  const isSuccess = useApplyInitialView();
  usePrefetchPages();
  useSetupShortcuts();

  if (!isSuccess) {
    return null;
  }

  return (
    <>
      <PlayerProvider>
        <AudioDataProvider>
          <DefaultView />
          <FocusView />
        </AudioDataProvider>
      </PlayerProvider>
      <EditView />
    </>
  );
}
