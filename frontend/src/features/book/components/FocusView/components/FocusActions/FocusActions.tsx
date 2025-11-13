import type { Dispatch, SetStateAction } from "react";
import { Divider, Group, Paper, Stack } from "@mantine/core";
import { MarkRestAsKnownButton } from "../../../common/MarkRestAsKnownButton/MarkRestAsKnownButton";
import { ShowDictionariesChip } from "./ShowDictionariesChip";
import { FocusToolbar } from "../FocusToolbar/FocusToolbar";
import { FocusBookmarksButton } from "../FocusBookmarksButton";
import type { BookDetail } from "../../../../api/types";

interface FocusActions {
  book: BookDetail;
  showDicts: boolean;
  onShowDicts: Dispatch<SetStateAction<boolean>>;
}

export function FocusActions({ book, showDicts, onShowDicts }: FocusActions) {
  return (
    <Paper shadow="md" withBorder radius={10} p={10}>
      <Stack gap={10}>
        <Group wrap="nowrap" gap={5} justify="center">
          <MarkRestAsKnownButton />
          <FocusBookmarksButton bookmarks={book.bookmarks} />
        </Group>

        <Divider />

        <FocusToolbar />

        <Divider />

        <ShowDictionariesChip
          checked={showDicts}
          onChange={() => onShowDicts((v) => !v)}
        />
      </Stack>
    </Paper>
  );
}
