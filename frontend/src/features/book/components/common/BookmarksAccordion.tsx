import { Accordion, Stack, type AccordionProps } from "@mantine/core";
import { BookmarkButton } from "../DefaultView/components/DefaultHeader/components/BookmarkButton";
import type { PageBookmark } from "../../api/types";

interface BookmarksAccordion extends AccordionProps {
  bookmarks: PageBookmark;
}

export function BookmarksAccordion({
  bookmarks,
  ...props
}: BookmarksAccordion) {
  return (
    <Accordion variant="filled" miw={220} disableChevronRotation {...props}>
      {Object.entries(bookmarks).map(([bookmarkPage, bookmarks]) => (
        <Accordion.Item key={bookmarkPage} value={String(bookmarkPage)}>
          <Accordion.Control fz="xs">Page {bookmarkPage}</Accordion.Control>
          <Accordion.Panel>
            <Stack gap={5} align="center">
              {bookmarks.map((bookmark) => (
                <BookmarkButton
                  key={bookmark.id}
                  id={bookmark.id}
                  page={Number(bookmarkPage)}
                  description={bookmark.description}
                />
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
