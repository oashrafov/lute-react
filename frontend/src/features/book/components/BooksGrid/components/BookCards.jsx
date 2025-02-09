import BookCard from "./BookCard";

function BookCards({ books, onEditSuccess }) {
  return books.map((book) => (
    <BookCard key={book.title} book={book} onEditSuccess={onEditSuccess} />
  ));
}

export default BookCards;
