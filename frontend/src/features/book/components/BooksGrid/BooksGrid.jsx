import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Pagination, SimpleGrid } from "@mantine/core";
import BooksGridTopToolbar from "./components/BooksGridTopToolbar";
import BookCards from "./components/BookCards";
import { DEFAULT_GRID_CARD_COUNT } from "@resources/constants";

const PAGINATION = {
  pageIndex: 0,
  pageSize: DEFAULT_GRID_CARD_COUNT,
};

const fetchURL = new URL("/api/books", "http://localhost:5001");

function BooksGrid() {
  const [shelf, setShelf] = useState("active");
  const [activePage, setPage] = useState(1);
  const [activeLang, setActiveLang] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState(null);
  const [sortingDirection, setSortDirection] = useState("desc");

  fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
  fetchURL.searchParams.set(
    "filters",
    JSON.stringify(activeLang ? [{ id: "language", value: activeLang }] : [])
  );
  fetchURL.searchParams.set(
    "start",
    `${(activePage - 1) * PAGINATION.pageSize}`
  );
  fetchURL.searchParams.set("size", `${PAGINATION.pageSize}`);
  fetchURL.searchParams.set("shelf", shelf);
  fetchURL.searchParams.set(
    "sorting",
    JSON.stringify(
      sorting ? [{ id: sorting, desc: sortingDirection === "desc" }] : []
    )
  );

  const { data } = useQuery({
    queryKey: ["books", fetchURL.href],
    queryFn: async () => {
      const response = await fetch(fetchURL.href);
      return await response.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
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

      <SimpleGrid cols={{ base: 1, xs: 2 }}>
        <BookCards books={data.data} onEditSuccess={() => setShelf("active")} />
      </SimpleGrid>

      <Pagination
        styles={{ root: { display: "flex", justifyContent: "flex-end" } }}
        mt={10}
        total={Math.ceil(data.filteredCount / PAGINATION.pageSize)}
        value={activePage}
        onChange={setPage}
      />
    </>
  );
}

export default BooksGrid;
