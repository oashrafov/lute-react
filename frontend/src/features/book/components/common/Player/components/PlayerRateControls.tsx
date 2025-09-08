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

export function PlayerRateControls() {
  const { state, dispatch, audio } = usePlayerContext();

  function handlePlaybackRateChange(delta: number) {
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

  function handleDecreasePlaybackRate() {
    return () => handlePlaybackRateChange(-0.1);
  }

  function handleIncreasePlaybackRate() {
    return () => handlePlaybackRateChange(0.1);
  }

  return (
    <Stack gap={0} align="center">
      <InputLabel fz="xs">Playback rate</InputLabel>
      <ActionIconGroup style={{ alignItems: "center" }}>
        <ActionIcon onClick={handleDecreasePlaybackRate} size="xs">
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
        <ActionIcon onClick={handleIncreasePlaybackRate} size="xs">
          <IconPlus size="80%" />
        </ActionIcon>
      </ActionIconGroup>
    </Stack>
  );
}
