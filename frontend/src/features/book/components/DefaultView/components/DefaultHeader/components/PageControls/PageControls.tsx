import { useState } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { Group, Stack, Tooltip } from "@mantine/core";
import {
  IconSquareRoundedCheckFilled,
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";
import { BookmarksButton } from "../../../../../common/BookmarksButton";
import { BookmarksMenu } from "../../../../../common/BookmarksMenu";
import { BookSourceButton } from "../../../../../common/BookSourceButton";
import { PageCounter } from "../../../../../common/PageCounter";
import { BookTitle } from "../../../../../common/BookTitle";
import { PageSlider } from "../PageSlider";
import { EditButton } from "../EditButton";
import { PageActionButton } from "../PageActionButton";
import { MarkRestAsKnownButton } from "../../../../../common/MarkRestAsKnownButton/MarkRestAsKnownButton";
import { usePageControl } from "../../../../../../hooks/usePageControl";
import type { BookDetail } from "../../../../../../api/types";
import classes from "./PageControls.module.css";
import { useMarkPageAsRead } from "../../../../../../hooks/useMarkPageAsRead";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

interface PageControls {
  book: BookDetail;
}

function BookInfoSection({ book }: { book: BookDetail }) {
  return (
    <div className={classes.titleFlex}>
      <BookTitle>{book.title}</BookTitle>
      {book.source && <BookSourceButton source={book.source} />}
      <PageCounter pageCount={book.pageCount} />
    </div>
  );
}

export function PageControls({ book }: PageControls) {
  const { pageNum } = route.useParams();
  const [changeVal, setChangeVal] = useState(pageNum);
  const markPageAsRead = useMarkPageAsRead();

  const { goToPage, goToNextPage, goToPreviousPage } =
    usePageControl(setChangeVal);

  function handleMarkPageAsReadAndNavigate() {
    markPageAsRead();
    goToNextPage();
  }

  let pageReadLabel = "Mark page as read";
  let PageReadIcon = IconSquareRoundedCheckFilled;
  if (pageNum !== book.pageCount) {
    pageReadLabel += " and go to next page";
    PageReadIcon = IconSquareRoundedChevronRightFilled;
  }

  return (
    <Stack w="100%" gap={0}>
      <div className={classes.titleFlex}>
        <EditButton />
        <BookInfoSection book={book} />

        <Group gap={0} wrap="nowrap">
          {book.bookmarks ? (
            <BookmarksMenu data={book.bookmarks}>
              <BookmarksButton />
            </BookmarksMenu>
          ) : (
            <BookmarksButton disabled />
          )}
          <MarkRestAsKnownButton />
        </Group>
      </div>

      <Group gap={2} wrap="nowrap">
        <PageActionButton
          onClick={goToPreviousPage}
          icon={IconSquareRoundedChevronLeftFilled}
          disabled={book.pageCount === 1 || pageNum === 1}
        />
        <PageSlider
          value={changeVal}
          onChange={setChangeVal}
          onChangeEnd={goToPage}
          max={book.pageCount}
          disabled={book.pageCount === 1}
        />
        <Group gap={0} wrap="nowrap">
          <PageActionButton
            onClick={goToNextPage}
            icon={IconSquareRoundedChevronRightFilled}
            disabled={book.pageCount === 1 || pageNum === book.pageCount}
          />
          <Tooltip label={pageReadLabel} position="right">
            <PageActionButton
              onClick={handleMarkPageAsReadAndNavigate}
              icon={PageReadIcon}
              disabled={book.pageCount === 1}
              color="orange.4"
            />
          </Tooltip>
        </Group>
      </Group>
    </Stack>
  );
}
