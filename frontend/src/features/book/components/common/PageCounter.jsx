import { Badge } from "@mantine/core";

export function PageCounter({ currentPage, pageCount }) {
  return (
    <Badge ml="auto" variant="light" fw={600} miw="max-content">
      {currentPage} / {pageCount}
    </Badge>
  );
}
