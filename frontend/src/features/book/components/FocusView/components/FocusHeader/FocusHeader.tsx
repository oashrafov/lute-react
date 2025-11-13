import { Box, Divider, Paper, Stack } from "@mantine/core";
import { NavLogo } from "../../../../../../components/common/NavLogo/NavLogo";
import { BookTitle } from "../../../common/BookTitle";
import { ThemeSelect } from "../../../../../../components/common/ThemeSelect/ThemeSelect";
import { PageCounter } from "../../../common/PageCounter";
import { BookSourceButton } from "../../../common/BookSourceButton";
import { FocusSwitch } from "../../../common/FocusSwitch/FocusSwitch";
import { HighlightsSwitch } from "../../../common/HighlightSwitch/HighlightSwitch";
import { PlayerSection } from "../../../common/PlayerSection";
import { useBookQuery } from "../../../../hooks/useBookQuery";
import classes from "./FocusHeader.module.css";

export function FocusHeader() {
  const { data: book } = useBookQuery();
  return (
    <Paper withBorder radius={0} shadow="sm" className={classes.header}>
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
        {book.audio && (
          <Box className={classes.playerContainer}>
            <PlayerSection />
          </Box>
        )}
      </Stack>

      <Divider orientation="vertical" />

      <ThemeSelect />
    </Paper>
  );
}
