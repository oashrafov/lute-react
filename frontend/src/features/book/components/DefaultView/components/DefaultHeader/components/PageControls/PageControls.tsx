import { useState } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { Group, Stack, Tooltip } from "@mantine/core";
import {
  IconRosetteDiscountCheckFilled,
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
import { usePageControl } from "../../../../../../hooks/usePageControl";
import type { BookDetail } from "../../../../../../api/types";
import classes from "./PageControls.module.css";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

interface PageControls {
  book: BookDetail;
}

export function PageControls({ book }: PageControls) {
  const { pageNum } = route.useParams();
  const [changeVal, setChangeVal] = useState(pageNum);

  const {
    goToPage,
    goToNextPage,
    goToPreviousPage,
    markPageAsRead,
    markRestAsKnown,
  } = usePageControl(setChangeVal);

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
        <div className={classes.titleFlex}>
          <BookTitle>{book.title}</BookTitle>
          {book.source && <BookSourceButton source={book.source} />}
          <PageCounter pageCount={book.pageCount} />
        </div>

        <Group gap={0} wrap="nowrap">
          {book.bookmarks && <BookmarksMenu data={book.bookmarks} />}
          {!book.bookmarks && <BookmarksButton disabled={true} />}
          <Tooltip label="Mark rest as known" position="right">
            <PageActionButton
              onClick={markRestAsKnown}
              icon={<IconRosetteDiscountCheckFilled />}
              color="green.6"
            />
          </Tooltip>
        </Group>
      </div>

      <Group gap={2} wrap="nowrap">
        <PageActionButton
          onClick={goToPreviousPage}
          icon={<IconSquareRoundedChevronLeftFilled />}
          disabled={book.pageCount === 1 || pageNum === 1}
        />
        <PageSlider
          book={book}
          value={changeVal}
          onChange={setChangeVal}
          onChangeEnd={goToPage}
        />
        <Group gap={0} wrap="nowrap">
          <PageActionButton
            onClick={goToNextPage}
            icon={<IconSquareRoundedChevronRightFilled />}
            disabled={book.pageCount === 1 || pageNum === book.pageCount}
          />
          <Tooltip label={pageReadLabel} position="right">
            <PageActionButton
              onClick={markPageAsRead}
              icon={<PageReadIcon />}
              disabled={book.pageCount === 1}
              color="orange.4"
            />
          </Tooltip>
        </Group>
      </Group>
    </Stack>
  );
}
