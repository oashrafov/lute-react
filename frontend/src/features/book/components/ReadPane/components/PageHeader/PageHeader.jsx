import { memo } from "react";
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
import Player from "../Player/Player";
import HomeImageLink from "@common/HomeImageLink/HomeImageLink";
import PageControls from "./components/PageControls";
import classes from "./PageHeader.module.css";

function PageHeader({ book, onSetActiveTerm, onDrawerOpen }) {
  const navigation = useNavigation();
  return (
    <>
      <Paper withBorder shadow="sm" className={`${classes.header} readpage`}>
        <Group wrap="nowrap" gap={10}>
          <ActionIcon onClick={onDrawerOpen} size="md" variant="subtle">
            <IconMenu2 />
          </ActionIcon>

          <Center className={classes.logoContainer}>
            {navigation.state === "loading" ? (
              <Loader size="sm" />
            ) : (
              <HomeImageLink size={48} />
            )}
          </Center>

          <Divider orientation="vertical" />
        </Group>

        <PageControls book={book} onSetActiveTerm={onSetActiveTerm} />
      </Paper>
      {book.audio && (
        <Paper withBorder shadow="sm" className={classes.playerContainer}>
          <Player book={book} />
        </Paper>
      )}
    </>
  );
}

export default memo(PageHeader);
