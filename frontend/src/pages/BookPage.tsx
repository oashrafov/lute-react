import { BookContextProvider } from "#book/store/bookContext";
import { BookView } from "#book/components/BookView/BookView.tsx";
import { SideMenu } from "#book/components/SideMenu/SideMenu";
import { PageTermsDrawer } from "#book/components/PageTermsDrawer/PageTermsDrawer";
import { useBookQuery } from "#book/hooks/useBookQuery";
import { ActiveTermProvider } from "#term/store/activeTermContext";
import { useDocumentTitle } from "#hooks/useDocumentTitle";
import { useNavigationProgress } from "#hooks/useNavigationProgress";
import { useViewSearchParams } from "#book/hooks/useViewSearchParams.ts";

export function BookPage() {
  const { data: book } = useBookQuery();
  useDocumentTitle(`Reading "${book.title}"`);
  useNavigationProgress();
  useViewSearchParams(book.languageId, book.textDirection);

  return (
    <BookContextProvider>
      <SideMenu />
      <PageTermsDrawer />

      <ActiveTermProvider>
        <BookView />
      </ActiveTermProvider>
    </BookContextProvider>
  );
}
