import { BookContextProvider } from "#book/store/bookContext";
import { Book } from "#book/components/Book/Book";
import { SideMenu } from "#book/components/SideMenu/SideMenu";
import { PageTermsDrawer } from "#book/components/PageTermsDrawer/PageTermsDrawer";
import { useBookQuery } from "#book/hooks/useBookQuery";
import { ActiveTermProvider } from "#term/store/activeTermContext";
import { useDocumentTitle } from "#hooks/useDocumentTitle";
import { useNavigationProgress } from "#hooks/useNavigationProgress";

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
