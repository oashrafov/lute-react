import { lazy, Suspense } from "react";
import { BookContextProvider } from "../../features/book/store/bookContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useMarkAsStale } from "../../features/book/hooks/useMarkAsStale";
import { useNavigationProgress } from "../../hooks/useNavigationProgress";
import { Book } from "../../features/book/components/Book/Book";
import { SideMenu } from "../../features/book/components/SideMenu/SideMenu";
import { ActiveTermContextProvider } from "../../features/term/store/activeTermContext";
import { ViewProvider } from "../../features/book/store/viewContext";
import { useBookQuery } from "../../features/book/hooks/useBookQuery";

const PageTermsDrawer = lazy(
  () => import("../../features/book/components/PageTermsDrawer/PageTermsDrawer")
);

export default function BookPage() {
  const { data: book } = useBookQuery();
  useDocumentTitle(`Reading "${book!.title}"`);
  useMarkAsStale();
  useNavigationProgress();

  return (
    <BookContextProvider>
      <SideMenu />
      <Suspense>
        <PageTermsDrawer />
      </Suspense>

      <ViewProvider>
        <ActiveTermContextProvider>
          <Book />
        </ActiveTermContextProvider>
      </ViewProvider>
    </BookContextProvider>
  );
}
