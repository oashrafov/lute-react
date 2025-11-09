import { Divider, Paper, Stack } from "@mantine/core";
import { Player } from "../../../common/Player/Player";
import { NavLogo } from "../../../../../../components/common/NavLogo/NavLogo";
import { BookTitle } from "../../../common/BookTitle";
import { ThemeSelect } from "../../../../../../components/common/ThemeSelect/ThemeSelect";
import { PageCounter } from "../../../common/PageCounter";
import { BookSourceButton } from "../../../common/BookSourceButton";
import { FocusSwitch } from "../../../common/FocusSwitch/FocusSwitch";
import { HighlightsSwitch } from "../../../common/HighlightSwitch/HighlightSwitch";
import { FOCUS_HEADER_HEIGHT } from "../../../../../../resources/constants";
import { useAudioQuery } from "../../../common/Player/hooks/useAudioQuery";
import type { BookDetail } from "../../../../api/types";
import classes from "./FocusHeader.module.css";

interface FocusHeader {
  book: BookDetail;
}

export function FocusHeader({ book }: FocusHeader) {
  const audioSource = useAudioQuery(book);
  return (
    <Paper
      withBorder
      radius={0}
      shadow="sm"
      className={classes.header}
      h={FOCUS_HEADER_HEIGHT}>
      <NavLogo />

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
        {book.audio && audioSource && (
          <div style={{ paddingInline: "1rem" }}>
            <Player source={audioSource} />
          </div>
        )}
      </Stack>

      <Divider orientation="vertical" />

      <ThemeSelect />
    </Paper>
  );
}
