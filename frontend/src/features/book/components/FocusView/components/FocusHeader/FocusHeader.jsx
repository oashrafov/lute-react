import { Divider, Paper, Stack } from "@mantine/core";
import { useParams } from "react-router-dom";
import { Player } from "@book/components/common/Player/Player";
import { HomeImageLink } from "@common/HomeImageLink/HomeImageLink";
import { SchemeToggleButton } from "@common/SchemeToggleButton/SchemeToggleButton";
import { Title } from "@book/components/common/Title";
import { PageCounter } from "@book/components/common/PageCounter";
import { BookSourceButton } from "@book/components/common/BookSourceButton";
import { FocusSwitch } from "@book/components/common/FocusSwitch/FocusSwitch";
import { HighlightsSwitch } from "@book/components/common/HighlightSwitch/HighlightSwitch";
import { FOCUS_HEADER_HEIGHT } from "@resources/constants";
import classes from "./FocusHeader.module.css";

export function FocusHeader({ book }) {
  const params = useParams();
  const page = Number(params.page);
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
          <Title title={book.title} component={page === 1 ? "h2" : "h1"} />
          {book.source && <BookSourceButton source={book.source} />}
          <PageCounter currentPage={page} pageCount={book.pageCount} />
        </div>
        {book.audio && (
          <div style={{ paddingInline: "1rem" }}>
            <Player book={book} />
          </div>
        )}
      </Stack>

      <Divider orientation="vertical" />

      <SchemeToggleButton />
    </Paper>
  );
}
