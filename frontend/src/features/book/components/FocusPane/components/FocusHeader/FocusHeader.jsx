import { Affix, Box, Divider, Paper, Stack, Transition } from "@mantine/core";
import { useParams } from "react-router-dom";
import Player from "@book/components/ReadPane/components/Player/Player";
import HomeImageLink from "@common/HomeImageLink/HomeImageLink";
import SchemeToggleButton from "@common/SchemeToggleButton/SchemeToggleButton";
import Title from "@book/components/ReadPane/components/PageHeader/components/Title";
import PageCounter from "@book/components/ReadPane/components/PageHeader/components/PageCounter";
import BookSourceButton from "@book/components/ReadPane/components/PageHeader/components/BookSourceButton";
import FocusSwitch from "@book/components/common/FocusSwitch/FocusSwitch";
import HighlightsSwitch from "@book/components/common/HighlightSwitch/HighlightSwitch";
import classes from "../../FocusPane.module.css";

function FocusHeader({ book, show }) {
  const params = useParams();
  const page = Number(params.page);
  return (
    <Affix position={{ top: 0, left: 0 }} zIndex={198} w="100%">
      <Transition transition="slide-down" mounted={show} duration={300}>
        {(styles) => (
          <Box style={styles}>
            <Paper withBorder radius={0} shadow="sm" className={classes.header}>
              <HomeImageLink size={48} />

              <Divider orientation="vertical" />

              <Stack gap={4} p={5}>
                <FocusSwitch />
                <HighlightsSwitch />
              </Stack>

              <Divider orientation="vertical" />

              <Stack flex={1} gap={8}>
                <div className={classes.inner}>
                  <Title
                    title={book.title}
                    component={page === 1 ? "h2" : "h1"}
                  />
                  {book.source && <BookSourceButton source={book.source} />}
                  <PageCounter counter={`${page}/${book.pageCount}`} />
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
          </Box>
        )}
      </Transition>
    </Affix>
  );
}

export default FocusHeader;
