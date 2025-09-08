import { useNavigation } from "react-router-dom";
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
import classes from "./DefaultHeader.module.css";

interface DefaultHeader {
  book: BookDetail;
}

export function DefaultHeader({ book }: DefaultHeader) {
  const navigation = useNavigation();
  const { drawer } = useBookContext();
  return (
    <>
      <Paper withBorder shadow="sm" className={`${classes.header} readpage`}>
        <Group wrap="nowrap" gap={10}>
          <ActionIcon onClick={drawer.open} size="md" variant="subtle">
            <IconMenu2 />
          </ActionIcon>

          <Center className={classes.logoContainer}>
            {navigation.state === "loading" && <Loader size="sm" />}
            {navigation.state !== "loading" && <HomeImageLink size={48} />}
          </Center>

          <Divider orientation="vertical" />
        </Group>

        <PageControls book={book} />
      </Paper>
      {book.audio && (
        <Paper withBorder shadow="sm" className={classes.playerContainer}>
          <Player />
        </Paper>
      )}
    </>
  );
}
