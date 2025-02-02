import { ActionIcon, ActionIconGroup } from "@mantine/core";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

function PlayerBookmarkControls({ audio, state, dispatch }) {
  function handleSaveRemoveBookmark() {
    const roundedTime = parseFloat(audio.currentTime.toFixed(1));
    state.bookmarks.map((bookmark) => bookmark.value).includes(roundedTime)
      ? dispatch({ type: "bookmarkRemoved", payload: roundedTime })
      : dispatch({ type: "bookmarkSaved", payload: roundedTime });
  }

  function handleSkipToBookmark(direction) {
    let val;
    const currentTime = audio.currentTime;

    if (direction === "next") {
      val = state.bookmarks
        .map((bookmark) => bookmark.value)
        .find((val) => Number(val) > currentTime);
    } else {
      val = state.bookmarks
        .map((bookmark) => bookmark.value)
        .findLast((val) => Number(val) < currentTime);
    }

    if (!val) return;

    audio.currentTime = val;
    dispatch({ type: "timeChanged", payload: val });
  }

  return (
    <ActionIconGroup style={{ alignItems: "center", gap: "4px" }}>
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
  );
}

export default PlayerBookmarkControls;
