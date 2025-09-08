import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Group,
  ScrollArea,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconCircleCheckFilled, IconSearch } from "@tabler/icons-react";
import { useBookContext } from "../../../features/book/hooks/useBookContext";
import { queries } from "../../../features/book/api/queries";

const searchParams = new URLSearchParams({ shelf: "active" });

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
              <Tooltip label={book.title} openDelay={200}>
                <Button
                  mb={2}
                  fullWidth
                  variant="subtle"
                  component={Link}
                  size="compact-sm"
                  onClick={drawer.close}
                  styles={{ inner: { justifyContent: "flex-start" } }}
                  style={{ textDecoration: "none", color: "inherit" }}
                  to={`/books/${book.id}/pages/${book.currentPage}`}>
                  <Group wrap="nowrap" gap={5}>
                    <ThemeIcon
                      size="sm"
                      color={book.isCompleted ? "green.6" : "dark.1"}
                      variant="transparent">
                      <IconCircleCheckFilled />
                    </ThemeIcon>
                    <Text fz="sm" lineClamp={1} truncate>
                      {book.title}
                    </Text>
                  </Group>
                </Button>
              </Tooltip>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </>
  );
}
