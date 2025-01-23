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

async function createBook(data) {
  const response = await fetch(`http://localhost:5001/api/books/new`, {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

async function getBookDataFromUrl(url) {
  const response = await fetch(`http://localhost:5001/api/books/url`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: url,
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

async function deleteBook(id) {
  const response = await fetch(`http://localhost:5001/api/books/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

async function editBook({ id, data }) {
  const response = await fetch(`http://localhost:5001/api/books/${id}`, {
    method: "PATCH",
    body: data,
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export {
  getBooks,
  getBook,
  getBookStats,
  getPage,
  createBook,
  deleteBook,
  editBook,
  getBookDataFromUrl,
};
