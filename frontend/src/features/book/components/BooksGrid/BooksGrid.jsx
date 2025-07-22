import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Group,
  InputLabel,
  Pagination,
  Select,
  SimpleGrid,
} from "@mantine/core";
import { IconChevronLeftPipe, IconChevronRightPipe } from "@tabler/icons-react";
import { BooksGridTopToolbar } from "./components/BooksGridTopToolbar";
import { BookCards } from "./components/BookCards";
import { DEFAULT_TABLE_ROW_COUNT } from "@resources/constants";
import { useMediaQuery } from "@hooks/useMediaQuery";

const PAGINATION = {
  pageIndex: 0,
  pageSize: DEFAULT_TABLE_ROW_COUNT,
};

const url = new URL("/api/books", "http://localhost:5001");

export function BooksGrid() {
  const media = useMediaQuery();

  const [shelf, setShelf] = useState("active");
  const [activePage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(String(PAGINATION.pageSize));
  const [activeLang, setActiveLang] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState(null);
  const [sortingDirection, setSortDirection] = useState("desc");

  url.searchParams.set("globalFilter", globalFilter ?? "");
  url.searchParams.set(
    "filters",
    JSON.stringify(activeLang ? [{ id: "language", value: activeLang }] : [])
  );
  url.searchParams.set("start", `${(activePage - 1) * pageSize}`);
  url.searchParams.set("size", pageSize);
  url.searchParams.set("shelf", shelf);
  url.searchParams.set(
    "sorting",
    JSON.stringify(
      sorting ? [{ id: sorting, desc: sortingDirection === "desc" }] : []
    )
  );

  const { data } = useQuery({
    queryKey: ["books", url.href],
    queryFn: async () => {
      const response = await fetch(url.href);
      return await response.json();
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  if (!data) return;

  return (
    <>
      <BooksGridTopToolbar
        activeLang={activeLang}
        setActiveLang={setActiveLang}
        shelf={shelf}
        onSetShelf={setShelf}
        sorting={sorting}
        onSetSorting={setSorting}
        sortingDirection={sortingDirection}
        onSetSortDirection={setSortDirection}
        globalFilter={globalFilter}
        onSetGlobalFilter={setGlobalFilter}
        hasArchived={data.archivedCount > 0 ? true : false}
      />

      <SimpleGrid cols={{ base: 1, xs: 2 }} mt={20}>
        <BookCards books={data.data} onEditSuccess={() => setShelf("active")} />
      </SimpleGrid>

      <Group justify="space-between" mt={20} style={{ rowGap: "10px" }}>
        <Group gap={10}>
          <InputLabel>Show:</InputLabel>
          <Select
            value={pageSize}
            onChange={setPageSize}
            data={["5", "10", "15", "20", "25"]}
            allowDeselect={false}
            w={100}
          />
        </Group>
        <Pagination
          firstIcon={IconChevronLeftPipe}
          lastIcon={IconChevronRightPipe}
          withEdges={true}
          withPages={media !== "mobile"}
          styles={{
            root: { display: "flex", justifyContent: "flex-end" },
            control: { width: "36px", height: "36px" },
          }}
          total={Math.ceil(data.filteredCount / pageSize)}
          value={activePage}
          onChange={setPage}
        />
      </Group>
    </>
  );
}
