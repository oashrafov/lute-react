import { Box, Divider, Group, Paper, Stack } from "@mantine/core";
import { PageControls } from "./components/PageControls/PageControls";
import { PlayerSection } from "../../../common/PlayerSection";
import { LogoSection } from "./components/LogoSection/LogoSection";
import { SideMenuButton } from "./components/SideMenuButton";
import { FocusSwitch } from "../../../common/FocusSwitch/FocusSwitch";
import { HighlightsSwitch } from "../../../common/HighlightSwitch/HighlightSwitch";
import { Toolbar } from "../Toolbar/Toolbar";
import { PageTermsButton } from "./components/PageTermsButton";
import type { BookDetail } from "../../../../api/types";
import classes from "./DefaultHeader.module.css";

interface DefaultHeader {
  book: BookDetail;
}

export function DefaultHeader({ book }: DefaultHeader) {
  return (
    <>
      <Paper withBorder shadow="sm" className={`${classes.header} readpage`}>
        <Group wrap="nowrap" gap={10}>
          <SideMenuButton />
          <LogoSection />
          <Divider orientation="vertical" />
        </Group>

        <Stack gap={4}>
          <FocusSwitch />
          <HighlightsSwitch />
        </Stack>

        <Divider orientation="vertical" />

        <Stack gap={2}>
          <Toolbar />
          <PageTermsButton />
        </Stack>

        <Divider orientation="vertical" />

        <PageControls book={book} />
      </Paper>
      {book.audio && (
        <Box className={classes.playerContainer}>
          <PlayerSection />
        </Box>
      )}
    </>
  );
}
