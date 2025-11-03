import { ActionIcon, Group, Slider, Text } from "@mantine/core";
import {
  IconChevronDown,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
} from "@tabler/icons-react";
import { PlayerMenu } from "./components/PlayerMenu";
import { PlayerSeekControls } from "./components/PlayerSeekControls";
import { useInitializePlayer } from "./hooks/useInitializePlayer";
import { convertSecsToDisplayString } from "../../../../../utils/utils";
import { usePlayerContext } from "./hooks/usePlayerContext";
import { useSetupPlayer } from "./hooks/useSetupPlayer";
import { useHighlightActiveBookmark } from "./hooks/useHighlightActiveBookmark";
import type { Audio } from "../../../api/types";
import classes from "./Player.module.css";

interface Player {
  audioData: Audio;
  source: string;
}

export function Player({ audioData, source }: Player) {
  const {
    state: { isPlaying, time, duration, bookmarks, volume },
    dispatch,
    audio,
  } = usePlayerContext();
  useInitializePlayer(audioData, source);
  useSetupPlayer();
  useHighlightActiveBookmark();

  function handlePlayPause() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    dispatch({ type: "statusToggled" });
  }

  function handleVolumeChange(volume: number) {
    audio.volume = volume;
    dispatch({ type: "volumeChanged", payload: audio.volume });
  }

  function handleSkipBack() {
    audio.currentTime = 0;
  }

  function handleChangeTime(v: number) {
    audio.currentTime = v;
  }

  return (
    <div className={classes.container}>
      <Group gap={8} wrap="nowrap">
        {/* SKIP BACK BUTTON */}
        <ActionIcon onClick={handleSkipBack} radius="50%" p={4} size={22}>
          <IconPlayerSkipBackFilled />
        </ActionIcon>

        <ActionIcon onClick={handlePlayPause} radius="50%" size={26} p={5}>
          {isPlaying && <IconPlayerPauseFilled />}
          {!isPlaying && <IconPlayerPlayFilled />}
        </ActionIcon>

        <PlayerSeekControls>{""}</PlayerSeekControls>
      </Group>

      <Group justify="space-between" flex={1} wrap="nowrap" gap={5}>
        <Text fz="xs" component="span" miw={50} ta="center">
          {convertSecsToDisplayString(time)}
        </Text>
        {/* TIME SLIDER */}
        <Slider
          label={null}
          marks={bookmarks.map((bookmark) => ({ value: bookmark }))}
          min={0}
          max={duration}
          step={0.1}
          value={time}
          onChange={handleChangeTime}
          classNames={{
            root: classes.timeSlider,
            mark: classes.mark,
            thumb: classes.thumb,
          }}
          size="md"
          thumbSize={12}
        />
        <Text fz="xs" component="span" miw={50} ta="center">
          {convertSecsToDisplayString(duration)}
        </Text>
      </Group>

      <Slider
        size="sm"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={handleVolumeChange}
        classNames={{ root: classes.volumeSlider, thumb: classes.thumb }}
      />

      <PlayerMenu>
        <ActionIcon size={24} p={0} variant="transparent">
          <IconChevronDown />
        </ActionIcon>
      </PlayerMenu>
    </div>
  );
}
