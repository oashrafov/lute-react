import { memo } from "react";
import { ActionIcon, Group, Slider, Text } from "@mantine/core";
import {
  IconChevronDown,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
} from "@tabler/icons-react";
import PlayerMenu from "./components/PlayerMenu";
import PlayerSeekControls from "./components/PlayerSeekControls";
import { usePlayer } from "./hooks/usePlayer";
import { useActivateBookmark } from "./hooks/useActivateBookmark";
import { convertSecsToDisplayString } from "@actions/utils";
import classes from "./Player.module.css";

const audio = new Audio();

function Player({ book }) {
  const [state, dispatch] = usePlayer(book, audio);
  useActivateBookmark(audio, state, dispatch);

  function handlePlayPause() {
    state.playing ? audio.pause() : audio.play();
    dispatch({ type: "statusToggled" });
  }

  function handleVolumeChange(volume) {
    audio.volume = volume;
    dispatch({ type: "volumeChanged", payload: audio.volume });
  }

  return (
    <div className={classes.container}>
      <Group gap={8} wrap="nowrap">
        {/* SKIP BACK BUTTON */}
        <ActionIcon
          onClick={() => (audio.currentTime = 0)}
          radius="50%"
          p={4}
          size={22}>
          <IconPlayerSkipBackFilled />
        </ActionIcon>

        <ActionIcon onClick={handlePlayPause} radius="50%" size={26} p={5}>
          {state.playing && <IconPlayerPauseFilled />}
          {!state.playing && <IconPlayerPlayFilled />}
        </ActionIcon>

        <PlayerSeekControls audio={audio} state={state} dispatch={dispatch} />
      </Group>

      <Group justify="space-between" flex={1} wrap="nowrap" gap={5}>
        <Text fz="xs" component="span" miw={50} ta="center">
          {convertSecsToDisplayString(state.time)}
        </Text>
        {/* TIME SLIDER */}
        <Slider
          label={null}
          marks={state.bookmarks}
          value={state.time}
          min={0}
          max={state.duration}
          step={0.1}
          onChange={(v) => (audio.currentTime = v)}
          classNames={{
            root: classes.timeSlider,
            mark: classes.mark,
            thumb: classes.thumb,
          }}
          size="md"
          thumbSize={12}
        />
        <Text fz="xs" component="span" miw={50} ta="center">
          {convertSecsToDisplayString(state.duration)}
        </Text>
      </Group>

      <Slider
        size="sm"
        value={state.volume}
        min={0}
        max={1}
        step={0.05}
        onChange={handleVolumeChange}
        classNames={{ root: classes.volumeSlider, thumb: classes.thumb }}
      />

      <PlayerMenu audio={audio} dispatch={dispatch} state={state}>
        <ActionIcon
          size={24}
          p={0}
          variant="transparent"
          styles={{ root: { border: "none" } }}>
          <IconChevronDown />
        </ActionIcon>
      </PlayerMenu>
    </div>
  );
}

export default memo(Player);
