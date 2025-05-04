import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ActionIcon, Divider, Group, Stack, Tooltip } from "@mantine/core";
import {
  IconBracketsContain,
  IconRosetteDiscountCheckFilled,
  IconSquareRoundedCheckFilled,
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
  IconTypography,
} from "@tabler/icons-react";
import PageSlider from "./PageSlider";
import BookmarksButton from "@book/components/common/BookmarksButton";
import BookmarksMenu from "@book/components/common/BookmarksMenu";
import EditButton from "./EditButton";
import BookSourceButton from "./BookSourceButton";
import PageActionButton from "./PageActionButton";
import PageCounter from "./PageCounter";
import Title from "./Title";
import FocusSwitch from "@book/components/common/FocusSwitch/FocusSwitch";
import HighlightsSwitch from "@book/components/common/HighlightSwitch/HighlightSwitch";
import { resetFocusActiveSentence } from "@actions/interactions-desktop";
import { clamp } from "@actions/utils";
import loader from "@term/api/loader";
import classes from "../PageHeader.module.css";

function PageControls({ book, onSetActiveTerm }) {
  const queryClient = useQueryClient();
  const params = useParams();
  const page = Number(params.page);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const [changeVal, setChangeVal] = useState(page);

  function goToPage(num) {
    const clamped = clamp(num, 1, book.pageCount);
    navigate(`/books/${book.id}/pages/${clamped}`);
    setChangeVal(clamped);
  }

  function goToNextPage() {
    goToPage(page + 1);
  }

  function goToPreviousPage() {
    goToPage(page - 1);
  }

  function markPageAsRead() {
    // todo: add mark as read logic
    goToNextPage();
  }

  function markRestAsKnown() {
    // todo: add mark rest as known logic
  }

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
        <ActionIcon size="sm" variant="subtle">
          <IconTypography />
        </ActionIcon>
        <Tooltip label="Open table with current page terms">
          <ActionIcon size="sm" variant="subtle" onClick={handleOpenTermsTable}>
            <IconBracketsContain />
          </ActionIcon>
        </Tooltip>
      </Stack>

      <Divider orientation="vertical" />

      <Stack w="100%" gap={0}>
        <div className={classes.titleFlex}>
          <EditButton onActivate={handleActivateEdit} />
          <div className={classes.titleFlex}>
            <Title title={book.title} component={page === 1 ? "h2" : "h1"} />
            {book.source && <BookSourceButton source={book.source} />}
            <PageCounter counter={`${page}/${book.pageCount}`} />
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

        <Group gap={2} wrap="no-wrap">
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

export default PageControls;
