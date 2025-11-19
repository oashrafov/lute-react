import { useQuery } from "@tanstack/react-query";
import { Box, ScrollArea, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useBookContext } from "#book/hooks/useBookContext";
import { queries } from "#book/api/queries";
import type { Shelf } from "#book/resources/types";
import { BookLinkButton } from "./BookLinkButton";

const searchParams = new URLSearchParams({ shelf: "active" as Shelf });

export function MenuBookList() {
  const { drawer } = useBookContext();
  const { data } = useQuery(queries.list(searchParams.toString()));

  return (
    <>
      <Box p={16}>
        <TextInput
          placeholder="Search"
          leftSection={<IconSearch />}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </Box>
      <ScrollArea flex={1} px={16} pb={16} type="never">
        <ul style={{ listStyle: "none" }}>
          {data?.data.map((book) => (
            <li key={book.id}>
              <BookLinkButton
                onClick={drawer.close}
                bookId={book.id}
                pageNum={book.currentPage}
                tooltip={book.title}
                isBookCompleted={book.isCompleted}>
                {book.title}
              </BookLinkButton>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </>
  );
}
