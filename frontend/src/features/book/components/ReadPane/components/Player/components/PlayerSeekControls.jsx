import {
  ActionIcon,
  ActionIconGroup,
  ActionIconGroupSection,
} from "@mantine/core";
import {
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
} from "@tabler/icons-react";

function PlayerSeekControls({ audio, state, dispatch, children }) {
  function handleForwardRewind(amount) {
    const t = audio.currentTime + amount;
    audio.currentTime = t;
    dispatch({ type: "timeChanged", payload: t });
  }

  return (
    <ActionIconGroup>
      <ActionIcon
        onClick={() => handleForwardRewind(-Number(state.skipAmount))}
        radius="50%"
        p={4}
        size={22}>
        <IconPlayerTrackPrevFilled />
      </ActionIcon>
      {children && <ActionIconGroupSection>{children}</ActionIconGroupSection>}
      <ActionIcon
        onClick={() => handleForwardRewind(Number(state.skipAmount))}
        radius="50%"
        p={4}
        size={22}>
        <IconPlayerTrackNextFilled />
      </ActionIcon>
    </ActionIconGroup>
  );
}

export default PlayerSeekControls;
