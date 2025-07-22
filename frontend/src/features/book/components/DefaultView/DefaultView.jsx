import { useBookPanel } from "@book/hooks/useBookPanel";
import { DefaultHeader } from "./components/DefaultHeader/DefaultHeader";
import { lazy, Suspense } from "react";
import { PageSpinner } from "@common/PageSpinner/PageSpinner";
import { TranslationPane } from "./components/TranslationPane/TranslationPane";
import { Box, Transition } from "@mantine/core";
import { HorizontalPanels } from "./components/ResizablePanels/HorizontalPanels";
import { useActiveTermContext } from "@book/hooks/useActiveTermContext";
import { FloatingContainer } from "../common/FloatingContainer/FloatingContainer";
import { useBook } from "@book/hooks/useBook";
import { useTerm } from "@book/hooks/useTerm";
import { PagePane } from "../PagePane/PagePane";
import classes from "./DefaultView.module.css";

const ThemeForm = lazy(
  () => import("@settings/components/ThemeForm/ThemeForm")
);
const BulkTermForm = lazy(
  () => import("@term/components/BulkTermForm/BulkTermForm")
);

export function DefaultView({ show }) {
  const { book, language } = useBook();
  const { data: term, isFetching } = useTerm();
  const { secondaryView } = useBookPanel(term);
  const { activeTerm } = useActiveTermContext();
  const showTranslationPane = secondaryView === "translation";
  const showBulkTermForm = secondaryView === "bulkTermForm";
  const showThemeForm = secondaryView === "themeForm";
  const translationPaneLoading =
    isFetching && !(showBulkTermForm || showThemeForm);

  return (
    <>
      <FloatingContainer show={show}>
        <HorizontalPanels
          leftPanel={
            <Box className={classes.paneLeft}>
              <Transition transition="slide-down" mounted={show} keepMounted>
                {(styles) => (
                  <Box style={styles}>
                    <DefaultHeader book={book} />
                  </Box>
                )}
              </Transition>
              <PagePane />
            </Box>
          }
          rightPanel={
            <>
              {translationPaneLoading ? (
                <PageSpinner />
              ) : (
                showTranslationPane && (
                  <TranslationPane term={term} language={language} />
                )
              )}

              {showBulkTermForm && (
                <Box p={20} h="100%">
                  <Suspense fallback={<PageSpinner />}>
                    <BulkTermForm terms={activeTerm.data} />
                  </Suspense>
                </Box>
              )}

              {showThemeForm && (
                <Box p={20} h="100%">
                  <Suspense fallback={<PageSpinner />}>
                    <ThemeForm />
                  </Suspense>
                </Box>
              )}
            </>
          }
        />
      </FloatingContainer>
    </>
  );
}
