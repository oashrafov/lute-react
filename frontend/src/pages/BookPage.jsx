import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { BookContextProvider } from "@book/store/bookContext";
import { useDocumentTitle } from "@hooks/useDocumentTitle";
import { useMarkAsStale } from "@book/hooks/useMarkAsStale";
import { useNavigationProgress } from "@hooks/useNavigationProgress";
import { getBookQuery } from "@book/api/query";
import { SideMenu } from "@book/components/SideMenu/SideMenu";
import { PageContextProvider } from "@book/store/pageContext";
import { ActiveTermContextProvider } from "@book/store/activeTermContext";
import { Book } from "@book/components/Book/Book";
import { ViewProvider } from "@book/store/viewContext";
import { ActiveDictTabProvider } from "@book/store/activeDictTabContext";

const PageTermsDrawer = lazy(
  () => import("@book/components/PageTermsDrawer/PageTermsDrawer")
);

function BookPage() {
  const { id } = useParams();
  const { data: book } = useQuery(getBookQuery(id));
  useDocumentTitle(`Reading "${book.title}"`);
  useMarkAsStale();
  useNavigationProgress();

  return (
    <BookContextProvider>
      <SideMenu />
      <Suspense>
        <PageTermsDrawer />
      </Suspense>

      <PageContextProvider>
        <ActiveTermContextProvider>
          <ActiveDictTabProvider>
            <ViewProvider>
              <Book />
            </ViewProvider>
          </ActiveDictTabProvider>
        </ActiveTermContextProvider>
      </PageContextProvider>
    </BookContextProvider>
  );
}

export default BookPage;
