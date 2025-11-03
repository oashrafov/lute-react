import { ActionIcon, ActionIconGroup, InputLabel, Stack } from "@mantine/core";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { usePlayerContext } from "../hooks/usePlayerContext";
import classes from "../Player.module.css";

export function PlayerBookmarkControls() {
  const { state, dispatch, audio } = usePlayerContext();

  function handleSaveRemoveBookmark() {
    const roundedTime = parseFloat(audio.currentTime.toFixed(1));

    if (state.bookmarks.includes(roundedTime)) {
      dispatch({ type: "bookmarkRemoved", payload: roundedTime });
    } else {
      dispatch({ type: "bookmarkSaved", payload: roundedTime });
    }
  }

  function handleSkipToBookmark(direction: "next" | "prev") {
    let val;
    const currentTime = audio.currentTime;

    if (direction === "next") {
      val = state.bookmarks.find((val) => val > currentTime);
    } else {
      val = state.bookmarks.findLast((val) => val < currentTime);
    }

    if (!val) return;

    audio.currentTime = val;
    dispatch({ type: "timeChanged", payload: val });
  }

  return (
    <Stack gap={0} align="center">
      <InputLabel fz="xs">Bookmarks</InputLabel>
      <ActionIconGroup className={classes.bookmarkControls}>
        <ActionIcon
          size={24}
          p={0}
          variant="transparent"
          onClick={handleSaveRemoveBookmark}
          styles={{ root: { border: "none" } }}>
          {state.bookmarkActive ? <IconBookmarkFilled /> : <IconBookmark />}
        </ActionIcon>
        <ActionIconGroup>
          <ActionIcon
            disabled={state.bookmarks.length === 0}
            onClick={() => handleSkipToBookmark("prev")}
            radius="50%"
            size="sm">
            <IconChevronLeft />
          </ActionIcon>
          <ActionIcon
            disabled={state.bookmarks.length === 0}
            onClick={() => handleSkipToBookmark("next")}
            radius="50%"
            size="sm">
            <IconChevronRight />
          </ActionIcon>
        </ActionIconGroup>
      </ActionIconGroup>
    </Stack>
  );
}
