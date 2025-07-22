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
import { HomeImageLink } from "@common/HomeImageLink/HomeImageLink";
import { PageControls } from "./components/PageControls/PageControls";
import { useBookContext } from "@book/hooks/useBookContext";
import classes from "./DefaultHeader.module.css";

export function DefaultHeader({ book }) {
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
          <Player book={book} />
        </Paper>
      )}
    </>
  );
}
