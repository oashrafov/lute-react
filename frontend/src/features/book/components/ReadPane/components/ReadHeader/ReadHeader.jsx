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
  rem,
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
import BookmarksButton from "../../../common/BookmarksButton";
import BookmarksMenu from "../../../common/BookmarksMenu";
import EditButton from "./components/EditButton";
import BookSourceButton from "./components/BookSourceButton";
import PageCounter from "./components/PageCounter";
import Title from "./components/Title";
import Player from "../Player/Player";
import Toolbar from "../Toolbar/Toolbar";
import FocusSwitch from "../../../common/FocusSwitch/FocusSwitch";
import HighlightsSwitch from "../../../common/HighlightSwitch/HighlightSwitch";
import MarkRestAsKnownButton from "../../../common/MarkRestAsKnownButton/MarkRestAsKnownButton";
import { resetFocusActiveSentence } from "@actions/interactions-desktop";
import loader from "@term/api/loader";
import classes from "./ReadHeader.module.css";

function ReadHeader({
  onDrawerOpen,
  book,
  focusMode,
  highlights,
  state,
  dispatch,
  onSetActiveTerm,
}) {
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

  const termIds = () =>
    Array.from(document.querySelectorAll(".word")).map(
      (word) => word.dataset.wid
    );

  return (
    <>
      <Paper
        withBorder
        classNames={{ root: "readpage" }}
        h={80}
        radius={0}
        shadow="sm"
        styles={{
          root: { position: "relative", zIndex: 2, borderInline: "none" },
        }}>
        <Group gap={5} wrap="nowrap" align="center" className={classes.header}>
          <ActionIcon onClick={onDrawerOpen} size="md" variant="subtle">
            <IconMenu2 />
          </ActionIcon>

          <Center
            w={48}
            h={48}
            styles={{ root: { flexShrink: 0, marginLeft: rem(16) } }}>
            {isLoading ? <Loader size="sm" /> : <HomeImageLink size={48} />}
          </Center>

          <Divider orientation="vertical" />

          <Stack gap={4}>
            <FocusSwitch checked={focusMode} dispatch={dispatch} />
            <HighlightsSwitch checked={highlights} dispatch={dispatch} />
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
                onClick={async () => {
                  await loader(queryClient)();
                  setSearchParams({ ids: JSON.stringify(termIds()) });
                }}>
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
        <Paper
          withBorder
          radius={0}
          shadow="sm"
          styles={{
            root: {
              position: "relative",
              zIndex: 2,
              borderInline: "none",
              borderTop: "none",
              padding: "0.3rem 2rem",
            },
          }}>
          <Player book={book} />
        </Paper>
      )}
      <Toolbar state={state} dispatch={dispatch} />
    </>
  );
}

export default memo(ReadHeader);
