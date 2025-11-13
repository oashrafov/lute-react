import { BookContextProvider } from "../features/book/store/bookContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useNavigationProgress } from "../hooks/useNavigationProgress";
import { Book } from "../features/book/components/Book/Book";
import { SideMenu } from "../features/book/components/SideMenu/SideMenu";
import { PageTermsDrawer } from "../features/book/components/PageTermsDrawer/PageTermsDrawer";
import { ActiveTermProvider } from "../features/term/store/activeTermContext";
import { useBookQuery } from "../features/book/hooks/useBookQuery";

export function BookPage() {
  const { data: book } = useBookQuery();
  useDocumentTitle(`Reading "${book.title}"`);
  useNavigationProgress();

  return (
    <BookContextProvider>
      <SideMenu />
      <PageTermsDrawer />

      <ActiveTermProvider>
        <Book />
      </ActiveTermProvider>
    </BookContextProvider>
  );
}
