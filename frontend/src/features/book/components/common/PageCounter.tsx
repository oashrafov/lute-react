import { Badge } from "@mantine/core";
import { useParams } from "react-router-dom";

interface PageCounter {
  pageCount: number;
}

export function PageCounter({ pageCount }: PageCounter) {
  const params = useParams();
  const currentPage = Number(params.page);
  return (
    <Badge ml="auto" variant="light" fw={600} miw="max-content">
      {currentPage} / {pageCount}
    </Badge>
  );
}
