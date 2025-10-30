import {
  ActionIcon,
  ActionIconGroup,
  ActionIconGroupSection,
  InputLabel,
  Stack,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { usePlayerContext } from "../hooks/usePlayerContext";

const PLAYBACK_RATE_STEP = 0.1;
const MIN_PLAYBACK_RATE = 0.1;
const MAX_PLAYBACK_RATE = 10.0;

export function PlayerRateControls() {
  const { state, dispatch, audio } = usePlayerContext();

  function handlePlaybackRateChange(delta: number) {
    const playbackRate = Math.min(
      Math.max((audio.playbackRate += delta), MIN_PLAYBACK_RATE),
      MAX_PLAYBACK_RATE
    );
    audio.playbackRate = playbackRate;
    dispatch({ type: "rateChanged", payload: playbackRate });
  }

  function handlePlaybackRateReset() {
    audio.playbackRate = 1.0;
    dispatch({ type: "rateChanged", payload: 1.0 });
  }

  function handleSetPlaybackRate(rate: number) {
    return () => handlePlaybackRateChange(rate);
  }

  return (
    <Stack gap={0} align="center">
      <InputLabel fz="xs">Playback rate</InputLabel>
      <ActionIconGroup style={{ alignItems: "center" }}>
        <ActionIcon
          onClick={handleSetPlaybackRate(-PLAYBACK_RATE_STEP)}
          size="xs">
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
        <ActionIcon
          onClick={handleSetPlaybackRate(PLAYBACK_RATE_STEP)}
          size="xs">
          <IconPlus size="80%" />
        </ActionIcon>
      </ActionIconGroup>
    </Stack>
  );
}
