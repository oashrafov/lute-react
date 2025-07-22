import { useNavigate, useParams } from "react-router-dom";

export function usePageControl(book, onNavigateToPage) {
  const params = useParams();
  const navigate = useNavigate();
  const page = Number(params.page);

  function goToPage(num) {
    if (num > book.pageCount || num < 1) return;

    navigate(`/books/${book.id}/pages/${num}`);
    onNavigateToPage && onNavigateToPage(num);
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
