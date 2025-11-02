import { usePrefetchPages } from "../../hooks/usePrefetchPages";
import { useSetupShortcuts } from "../../hooks/useSetupShortcuts";
import { DefaultView } from "../DefaultView/DefaultView";
import { EditView } from "../EditView/EditView";
import { FocusView } from "../FocusView/FocusView";
import { PageSpinner } from "../../../../components/common/PageSpinner/PageSpinner";
import { PlayerProvider } from "../common/Player/store/playerContext";
import { useApplyInitialView } from "../../hooks/useApplyInitialView";

export function Book() {
  const isSuccess = useApplyInitialView();
  usePrefetchPages();
  useSetupShortcuts();

  if (!isSuccess) {
    return <PageSpinner />;
  }

  return (
    <>
      <PlayerProvider>
        <DefaultView />
        <FocusView />
      </PlayerProvider>
      <EditView />
    </>
  );
}
