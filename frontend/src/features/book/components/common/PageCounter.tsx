import { Badge } from "@mantine/core";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

interface PageCounter {
  pageCount: number;
}

export function PageCounter({ pageCount }: PageCounter) {
  const { pageNum } = route.useParams();
  return (
    <Badge ml="auto" variant="light" fw={600} miw="max-content">
      {pageNum} / {pageCount}
    </Badge>
  );
}
