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
import classes from "../DrawerMenu.module.css";

const url = new URL("/api/books", "http://localhost:5001");
url.searchParams.set("shelf", "active");

function MenuBookList({ onDrawerClose }) {
  const { data } = useQuery({
    queryKey: ["books", url.href],
    queryFn: async () => {
      const response = await fetch(url.href);
      return await response.json();
    },
    staleTime: Infinity,
  });

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
      <ScrollArea
        className={classes.scroll}
        pl={16}
        pr={16}
        pb={16}
        type="never">
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
                  onClick={onDrawerClose}
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

export default MenuBookList;
