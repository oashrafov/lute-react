import { useQuery } from "@tanstack/react-query";
import { getBookQuery } from "@book/api/query";
import { userLanguageQuery } from "@language/api/query";
import { useParams } from "react-router-dom";

export function useBook() {
  const { id } = useParams();
  const { data: book } = useQuery(getBookQuery(id));
  const { data: language } = useQuery(userLanguageQuery(book.languageId));

  return { book, language };
}
