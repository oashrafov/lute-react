import {
  ActionIcon,
  ActionIconGroup,
  ActionIconGroupSection,
} from "@mantine/core";
import {
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
} from "@tabler/icons-react";
import { usePlayerContext } from "../hooks/usePlayerContext";

export function PlayerSeekControls({ children }) {
  const { state, dispatch, audio } = usePlayerContext();

  function handleForwardRewind(amount) {
    const t = audio.currentTime + amount;
    audio.currentTime = t;
    dispatch({ type: "timeChanged", payload: t });
  }

  function handleRewind() {
    handleForwardRewind(-Number(state.skipAmount));
  }

  function handleFF() {
    handleForwardRewind(Number(state.skipAmount));
  }

  return (
    <ActionIconGroup>
      <ActionIcon onClick={handleRewind} radius="50%" p={4} size={22}>
        <IconPlayerTrackPrevFilled />
      </ActionIcon>
      {children && <ActionIconGroupSection>{children}</ActionIconGroupSection>}
      <ActionIcon onClick={handleFF} radius="50%" p={4} size={22}>
        <IconPlayerTrackNextFilled />
      </ActionIcon>
    </ActionIconGroup>
  );
}
