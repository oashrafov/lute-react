export const keys = {
  books: ["books"],
  book: (id) => ["book", id],
  page: (bookId, pageNum) => ["page", bookId, pageNum],
  stats: (id) => ["bookStats", id],
  bookmarks: (id) => ["bookmarks", id],
};
