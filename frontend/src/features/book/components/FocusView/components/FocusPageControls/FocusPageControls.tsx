import { useParams } from "react-router-dom";
import { ActionIcon, Stack } from "@mantine/core";
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { usePageControl } from "../../../../hooks/usePageControl";
import { FloatingContainer } from "../../../common/FloatingContainer/FloatingContainer";
import type { BookDetail } from "../../../../api/types";

interface FocusPageControls {
  book: BookDetail;
  show: boolean;
}

export function FocusPageControls({ book, show }: FocusPageControls) {
  const params = useParams();
  const page = Number(params.page);
  const { goToNextPage, goToPreviousPage } = usePageControl();

  return (
    <>
      <FloatingContainer
        position={{ top: "50%", left: 20 }}
        transition="slide-right"
        show={show}
        zIndex={198}>
        <ActionIcon
          onClick={goToPreviousPage}
          disabled={book.pageCount === 1 || page === 1}
          variant="light"
          size="xl"
          h={100}
          style={{ translate: "0 -50%" }}>
          <IconChevronLeft />
        </ActionIcon>
      </FloatingContainer>

      <FloatingContainer
        position={{ top: "50%", right: 20 }}
        transition="slide-left"
        show={show}
        zIndex={198}>
        <Stack style={{ translate: "0 -50%" }} gap={5}>
          <ActionIcon
            color="orange"
            onClick={goToNextPage}
            disabled={book.pageCount === 1}
            variant="light"
            size="xl">
            {book.pageCount ? <IconCheck /> : <IconChevronRight />}
          </ActionIcon>
          <ActionIcon
            onClick={goToNextPage}
            disabled={book.pageCount === 1 || page === book.pageCount}
            variant="light"
            size="xl"
            h={100}>
            <IconChevronRight />
          </ActionIcon>
        </Stack>
      </FloatingContainer>
    </>
  );
}
