import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { ActionIcon, Divider, Group, Stack, Tooltip } from "@mantine/core";
import {
  IconBracketsContain,
  IconRosetteDiscountCheckFilled,
  IconSquareRoundedCheckFilled,
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
  IconTypography,
} from "@tabler/icons-react";
import { BookmarksButton } from "../../../../../common/BookmarksButton";
import { BookmarksMenu } from "../../../../../common/BookmarksMenu";
import { BookSourceButton } from "../../../../../common/BookSourceButton";
import { PageCounter } from "../../../../../common/PageCounter";
import { BookTitle } from "../../../../../common/BookTitle";
import { FocusSwitch } from "../../../../../common/FocusSwitch/FocusSwitch";
import { HighlightsSwitch } from "../../../../../common/HighlightSwitch/HighlightSwitch";
import { PageSlider } from "../PageSlider";
import { EditButton } from "../EditButton";
import { PageActionButton } from "../PageActionButton";
import { Toolbar } from "../../../Toolbar/Toolbar";
import { usePageControl } from "../../../../../../hooks/usePageControl";
import { loader } from "../../../../../../../../pages/TermsPage/loader";
import { getWords } from "../../../../../../../../helpers/text";
import type { BookDetail } from "../../../../../../api/types";
import classes from "./PageControls.module.css";

interface PageControls {
  book: BookDetail;
}

export function PageControls({ book }: PageControls) {
  const queryClient = useQueryClient();

  const params = useParams();
  const page = Number(params.page);
  const [, setSearchParams] = useSearchParams();
  const [changeVal, setChangeVal] = useState(page);

  const {
    goToPage,
    goToNextPage,
    goToPreviousPage,
    markPageAsRead,
    markRestAsKnown,
  } = usePageControl(setChangeVal);

  async function handleOpenTermsTable() {
    const termIds = getWords().map((word) => word.dataset.wordId);
    await loader(queryClient)();
    setSearchParams({ ids: JSON.stringify(termIds) });
  }

  const pageReadLabel =
    page === book.pageCount
      ? "Mark page as read"
      : "Mark page as read and go to next page";

  const PageReadIcon =
    page === book.pageCount
      ? IconSquareRoundedCheckFilled
      : IconSquareRoundedChevronRightFilled;

  return (
    <>
      <Stack gap={4}>
        <FocusSwitch />
        <HighlightsSwitch />
      </Stack>

      <Divider orientation="vertical" />

      <Stack gap={2}>
        <Toolbar>
          <ActionIcon size="sm" variant="subtle">
            <IconTypography />
          </ActionIcon>
        </Toolbar>
        <Tooltip label="Open table with current page terms">
          <ActionIcon size="sm" variant="subtle" onClick={handleOpenTermsTable}>
            <IconBracketsContain />
          </ActionIcon>
        </Tooltip>
      </Stack>

      <Divider orientation="vertical" />

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
            disabled={book.pageCount === 1 || page === 1}
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
              disabled={book.pageCount === 1 || page === book.pageCount}
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
    </>
  );
}
