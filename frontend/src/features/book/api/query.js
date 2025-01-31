import { getBook, getBooks, getBookStats, getPage } from "./api";
import { keys } from "./keys";

const getBooksQuery = {
  queryKey: keys.books,
  queryFn: getBooks,
  staleTime: Infinity,
};

const getBookQuery = (id) => ({
  queryKey: keys.book(id),
  queryFn: () => getBook(id),
  refetchOnWindowFocus: false,
});

const getBookStatsQuery = (id) => ({
  queryKey: keys.stats(id),
  queryFn: () => getBookStats(id),
  enabled: id !== null,
});

const getPageQuery = (bookId, pageNum) => ({
  queryKey: keys.page(bookId, pageNum),
  queryFn: () => getPage(bookId, pageNum),
  refetchOnWindowFocus: false,
});

export { getBooksQuery, getBookQuery, getBookStatsQuery, getPageQuery };
