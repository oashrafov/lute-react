async function getBooks() {
  const response = await fetch("http://localhost:5001/api/books/");
  return await response.json();
}

async function getBook(id) {
  const response = await fetch(`http://localhost:5001/api/books/${id}`);
  return await response.json();
}

async function getBookStats(id) {
  const response = await fetch(`http://localhost:5001/api/books/${id}/stats`);
  return await response.json();
}

async function getPage(bookId, pageNum) {
  const response = await fetch(
    `http://localhost:5001/api/books/${bookId}/pages/${pageNum}`
  );
  return await response.json();
}

export { getBooks, getBook, getBookStats, getPage };
