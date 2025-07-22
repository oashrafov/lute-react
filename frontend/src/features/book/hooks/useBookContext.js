import { BookContext } from "@book/store/bookContext";
import { useContext } from "react";

export function useBookContext() {
  return useContext(BookContext);
}
