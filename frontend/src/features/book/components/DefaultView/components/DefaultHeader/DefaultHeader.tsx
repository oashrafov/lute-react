import { useRouterState } from "@tanstack/react-router";
import {
  ActionIcon,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { Player } from "../../../common/Player/Player";
import { HomeImageLink } from "../../../../../../components/common/HomeImageLink/HomeImageLink";
import { PageControls } from "./components/PageControls/PageControls";
import { useBookContext } from "../../../../hooks/useBookContext";
import type { BookDetail } from "../../../../api/types";
import { useAudioQuery } from "../../../common/Player/hooks/useAudioQuery";
import classes from "./DefaultHeader.module.css";

interface DefaultHeader {
  book: BookDetail;
}

export function DefaultHeader({ book }: DefaultHeader) {
  const state = useRouterState();
  const { drawer } = useBookContext();
  const audioSource = useAudioQuery(book);
  return (
    <>
      <Paper withBorder shadow="sm" className={`${classes.header} readpage`}>
        <Group wrap="nowrap" gap={10}>
          <ActionIcon onClick={drawer.open} size="md" variant="subtle">
            <IconMenu2 />
          </ActionIcon>

          <Center className={classes.logoContainer}>
            {state.status === "pending" && <Loader size="sm" />}
            {state.status === "idle" && <HomeImageLink size={48} />}
          </Center>

          <Divider orientation="vertical" />
        </Group>

        <PageControls book={book} />
      </Paper>
      {book.audio && audioSource && (
        <Paper withBorder shadow="sm" className={classes.playerContainer}>
          <Player audioData={book.audio} source={audioSource} />
        </Paper>
      )}
    </>
  );
}
