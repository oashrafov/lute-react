import { useNavigate, useParams } from "react-router-dom";
import { ActionIcon, Affix, Stack, Transition } from "@mantine/core";
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { clamp } from "@actions/utils";

function FocusPageTurner({ book, show }) {
  const navigate = useNavigate();
  const params = useParams();
  const page = Number(params.page);

  function goToPage(num) {
    const clamped = clamp(num, 1, book.pageCount);
    navigate(`/books/${book.id}/pages/${clamped}`);
  }

  const pageReadIcon =
    page === book.pageCount ? <IconCheck /> : <IconChevronRight />;

  return (
    <>
      <Affix position={{ top: "50%", left: 20 }} zIndex={198}>
        <Transition transition="slide-right" mounted={show}>
          {(styles) => (
            <div style={styles}>
              <ActionIcon
                onClick={() => goToPage(page - 1)}
                disabled={book.pageCount === 1 || page === 1}
                variant="light"
                size="xl"
                h={100}
                style={{ translate: "0 -50%" }}>
                <IconChevronLeft />
              </ActionIcon>
            </div>
          )}
        </Transition>
      </Affix>

      <Affix position={{ top: "50%", right: 20 }} zIndex={198}>
        <Transition transition="slide-left" mounted={show}>
          {(styles) => (
            <div style={{ translate: "0 -50%" }}>
              <Stack style={styles} gap={5}>
                <ActionIcon
                  color="orange"
                  onClick={() => goToPage(page + 1)}
                  disabled={book.pageCount === 1}
                  variant="light"
                  size="xl">
                  {pageReadIcon}
                </ActionIcon>
                <ActionIcon
                  onClick={() => goToPage(page + 1)}
                  disabled={book.pageCount === 1 || page === book.pageCount}
                  variant="light"
                  size="xl"
                  h={100}>
                  <IconChevronRight />
                </ActionIcon>
              </Stack>
            </div>
          )}
        </Transition>
      </Affix>
    </>
  );
}

export default FocusPageTurner;
