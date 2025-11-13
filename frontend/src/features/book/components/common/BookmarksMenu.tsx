import { type ReactNode } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { Divider, Menu, Text } from "@mantine/core";
import { BookmarksAccordion } from "./BookmarksAccordion";
import type { PageBookmark } from "../../api/types";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

interface BookmarksMenu {
  data: PageBookmark;
  children: ReactNode;
}

export function BookmarksMenu({ data, children }: BookmarksMenu) {
  const { pageNum } = route.useParams();

  const bookmarkCount = Object.values(data).reduce(
    (acc, current) => acc + current.length,
    0
  );
  const pageCount = Object.keys(data).length;

  return (
    <Menu trigger="click" position="bottom-start" withArrow>
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown p={0}>
        <>
          <Text p="xs" fz="sm" ta="center">
            {bookmarkCount} bookmarks in {pageCount} page(s)
          </Text>

          <Divider />

          <BookmarksAccordion defaultValue={String(pageNum)} bookmarks={data} />
        </>
      </Menu.Dropdown>
    </Menu>
  );
}
