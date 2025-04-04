import { memo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation, useParams, useSearchParams } from "react-router-dom";
import {
  ActionIcon,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Tooltip,
} from "@mantine/core";
import {
  IconBracketsContain,
  IconMenu2,
  IconTypography,
} from "@tabler/icons-react";
import HomeImageLink from "@common/HomeImageLink/HomeImageLink";
import PageSlider from "./components/PageSlider";
import BookmarksButton from "@book/components/common/BookmarksButton";
import BookmarksMenu from "@book/components/common/BookmarksMenu";
import EditButton from "./components/EditButton";
import BookSourceButton from "./components/BookSourceButton";
import PageCounter from "./components/PageCounter";
import Title from "./components/Title";
import Player from "../Player/Player";
import FocusSwitch from "@book/components/common/FocusSwitch/FocusSwitch";
import HighlightsSwitch from "@book/components/common/HighlightSwitch/HighlightSwitch";
import MarkRestAsKnownButton from "@book/components/common/MarkRestAsKnownButton/MarkRestAsKnownButton";
import { resetFocusActiveSentence } from "@actions/interactions-desktop";
import loader from "@term/api/loader";
import classes from "./ReadHeader.module.css";

function ReadHeader({ book, state, dispatch, onSetActiveTerm, onDrawerOpen }) {
  const queryClient = useQueryClient();
  const params = useParams();
  const page = Number(params.page);
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const [, setSearchParams] = useSearchParams();

  function handleActivateEdit() {
    onSetActiveTerm({ data: null });
    resetFocusActiveSentence();
    setSearchParams({ edit: "true" });
  }

  async function handleOpenTermsTable() {
    const textItems = Array.from(document.querySelectorAll(".word"));
    const termIds = textItems.map((word) => word.dataset.wid);
    await loader(queryClient)();
    setSearchParams({ ids: JSON.stringify(termIds) });
  }

  return (
    <>
      <Paper withBorder className={`${classes.header} readpage`} shadow="sm">
        <Group className={classes.inner}>
          <ActionIcon onClick={onDrawerOpen} size="md" variant="subtle">
            <IconMenu2 />
          </ActionIcon>

          <Center className={classes.logoContainer}>
            {isLoading ? <Loader size="sm" /> : <HomeImageLink size={48} />}
          </Center>

          <Divider orientation="vertical" />

          <Stack gap={4}>
            <FocusSwitch checked={state.focusMode} dispatch={dispatch} />
            <HighlightsSwitch checked={state.highlights} dispatch={dispatch} />
          </Stack>

          <Divider orientation="vertical" />

          <Stack gap={2}>
            <ActionIcon size="sm" variant="subtle">
              <IconTypography />
            </ActionIcon>
            <Tooltip label="Open table with current page terms">
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={handleOpenTermsTable}>
                <IconBracketsContain />
              </ActionIcon>
            </Tooltip>
          </Stack>

          <Divider orientation="vertical" />

          <Stack w="100%" gap={0}>
            <div className={classes.titleFlex}>
              <EditButton onActivate={handleActivateEdit} />
              <div className={classes.titleFlex}>
                <Title
                  title={book.title}
                  component={page === 1 ? "h2" : "h1"}
                />
                {book.source && <BookSourceButton source={book.source} />}
                <PageCounter counter={`${page}/${book.pageCount}`} />
              </div>

              <Group gap={0} wrap="nowrap">
                {book.bookmarks && <BookmarksMenu data={book.bookmarks} />}
                {!book.bookmarks && <BookmarksButton disabled={true} />}
                <MarkRestAsKnownButton />
              </Group>
            </div>

            <PageSlider book={book} />
          </Stack>
        </Group>
      </Paper>
      {book.audio && (
        <Paper withBorder shadow="sm" className={classes.playerContainer}>
          <Player book={book} />
        </Paper>
      )}
    </>
  );
}

export default memo(ReadHeader);
