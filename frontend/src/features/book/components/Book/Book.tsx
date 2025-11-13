import { usePrefetchPages } from "../../hooks/usePrefetchPages";
import { useSetupShortcuts } from "../../hooks/useSetupShortcuts";
import { DefaultView } from "../DefaultView/DefaultView";
import { EditView } from "../EditView/EditView";
import { FocusView } from "../FocusView/FocusView";
import { PlayerProvider } from "../common/Player/store/playerContext";
import { AudioDataProvider } from "../common/Player/store/audioDataContext";
import { useView } from "../../hooks/useView";

export function Book() {
  const { view } = useView();
  usePrefetchPages();
  useSetupShortcuts();

  return (
    <>
      <PlayerProvider>
        <AudioDataProvider>
          {view === "default" && <DefaultView />}
          {view === "focus" && <FocusView />}
        </AudioDataProvider>
      </PlayerProvider>
      {view === "edit" && <EditView />}
    </>
  );
}
