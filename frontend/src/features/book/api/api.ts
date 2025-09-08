import { endpoints } from "./endpoints";
import { getFormDataFromObj } from "../../../utils/utils";
import type {
  BookDetail,
  BooksList,
  BookStats,
  EditBook,
  NewBookForm,
  Page,
} from "./types";

export async function getBooks(filters?: string): Promise<BooksList> {
  const url = filters ? `${endpoints.getBooks}?${filters}` : endpoints.getBooks;
  const response = await fetch(url);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getBook(id: number): Promise<BookDetail> {
  const response = await fetch(endpoints.getBook(id));

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getBookStats(id: number): Promise<BookStats> {
  const response = await fetch(endpoints.getBookStats(id));

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getPage(bookId: number, pageNum: number): Promise<Page> {
  const response = await fetch(endpoints.getPage(bookId, pageNum));

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getBookFormInitValues(): Promise<NewBookForm> {
  const response = await fetch(endpoints.getBookFormInitValues);

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function createBook(data: NewBookForm) {
  const response = await fetch(endpoints.createBook, {
    method: "POST",
    body: getFormDataFromObj(data),
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function getBookDataFromUrl(url: string) {
  const response = await fetch(endpoints.getBookDataFromUrl, {
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

export async function deleteBook(id: number) {
  const response = await fetch(endpoints.deleteBook(id), {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function editBook({ id, data }: EditBook) {
  const response = await fetch(endpoints.editBook(id), {
    method: "PATCH",
    body: getFormDataFromObj(data),
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}

export async function commitPage({ id, page }: { id: number; page: number }) {
  const response = await fetch(endpoints.commitPage(id, page), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shouldTrack: true }),
  });

  if (!response.ok) {
    const message = await response.json();
    throw new Error(message);
  }

  return await response.json();
}
