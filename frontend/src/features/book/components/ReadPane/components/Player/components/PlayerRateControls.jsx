import {
  ActionIcon,
  ActionIconGroup,
  ActionIconGroupSection,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";

function PlayerRateControls({ audio, state, dispatch }) {
  function handlePlaybackRateChange(delta) {
    const playbackRate = Math.min(
      Math.max((audio.playbackRate += delta), 0.1),
      10
    );
    audio.playbackRate = playbackRate;
    dispatch({ type: "rateChanged", payload: playbackRate });
  }

  function handlePlaybackRateReset() {
    audio.playbackRate = 1.0;
    dispatch({ type: "rateChanged", payload: 1.0 });
  }

  return (
    <ActionIconGroup style={{ alignItems: "center" }}>
      <ActionIcon onClick={() => handlePlaybackRateChange(-0.1)} size="xs">
        <IconMinus size="80%" />
      </ActionIcon>
      <ActionIconGroupSection variant="transparent">
        <Tooltip label="Click to reset" fz="xs">
          <UnstyledButton
            miw={20}
            fz="sm"
            ta="center"
            onClick={handlePlaybackRateReset}>
            {state.rate.toFixed(1)}
          </UnstyledButton>
        </Tooltip>
      </ActionIconGroupSection>
      <ActionIcon onClick={() => handlePlaybackRateChange(0.1)} size="xs">
        <IconPlus size="80%" />
      </ActionIcon>
    </ActionIconGroup>
  );
}

export default PlayerRateControls;
