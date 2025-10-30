import { Divider, Paper, Stack } from "@mantine/core";
import { Player } from "../../../common/Player/Player";
import { HomeImageLink } from "../../../../../../components/common/HomeImageLink/HomeImageLink";
import { BookTitle } from "../../../common/BookTitle";
import { ThemeSelect } from "../../../../../../components/common/ThemeSelect/ThemeSelect";
import { PageCounter } from "../../../common/PageCounter";
import { BookSourceButton } from "../../../common/BookSourceButton";
import { FocusSwitch } from "../../../common/FocusSwitch/FocusSwitch";
import { HighlightsSwitch } from "../../../common/HighlightSwitch/HighlightSwitch";
import { FOCUS_HEADER_HEIGHT } from "../../../../../../resources/constants";
import type { BookDetail } from "../../../../api/types";
import classes from "./FocusHeader.module.css";

interface FocusHeader {
  book: BookDetail;
}

export function FocusHeader({ book }: FocusHeader) {
  return (
    <Paper
      withBorder
      radius={0}
      shadow="sm"
      className={classes.header}
      h={FOCUS_HEADER_HEIGHT}>
      <HomeImageLink size={48} />

      <Divider orientation="vertical" />

      <Stack gap={4} p={5}>
        <FocusSwitch />
        <HighlightsSwitch />
      </Stack>

      <Divider orientation="vertical" />

      <Stack flex={1} gap={8}>
        <div className={classes.inner}>
          <BookTitle>{book.title}</BookTitle>
          {book.source && <BookSourceButton source={book.source} />}
          <PageCounter pageCount={book.pageCount} />
        </div>
        {book.audio && (
          <div style={{ paddingInline: "1rem" }}>
            <Player audioData={book.audio} />
          </div>
        )}
      </Stack>

      <Divider orientation="vertical" />

      <ThemeSelect />
    </Paper>
  );
}
