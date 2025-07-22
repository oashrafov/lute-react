import BookCard from "./BookCard";

export function BookCards({ books, onEditSuccess }) {
  return books.map((book) => (
    <BookCard key={book.title} book={book} onEditSuccess={onEditSuccess} />
  ));
}
