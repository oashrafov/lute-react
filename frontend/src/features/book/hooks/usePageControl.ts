import { useNavigate, useParams } from "react-router-dom";
import { useBookQuery } from "./useBookQuery";

export function usePageControl(onNavigate?: (num: number) => void) {
  const params = useParams();
  const navigate = useNavigate();
  const page = Number(params.page);
  const { data: book } = useBookQuery();

  function goToPage(num: number) {
    if (num > book.pageCount || num < 1) return;

    navigate(`/books/${book.id}/pages/${num}`);
    if (onNavigate) onNavigate(num);
  }

  function goToNextPage() {
    goToPage(page + 1);
  }

  function goToPreviousPage() {
    goToPage(page - 1);
  }

  function markPageAsRead() {
    // todo: add mark as read logic
    goToNextPage();
  }

  function markRestAsKnown() {
    // todo: add mark rest as known logic
  }

  return {
    goToPage,
    goToNextPage,
    goToPreviousPage,
    markPageAsRead,
    markRestAsKnown,
  };
}
