import { lazy, Suspense } from "react";
import { Box, Transition } from "@mantine/core";
import { useSecondaryView } from "../../hooks/useSecondaryView";
import { DefaultHeader } from "./components/DefaultHeader/DefaultHeader";
import { PageSpinner } from "../../../../components/common/PageSpinner/PageSpinner";
import { TranslationPane } from "./components/TranslationPane/TranslationPane";
import { HorizontalPanels } from "./components/ResizablePanels/HorizontalPanels";
import { useActiveTermContext } from "../../../term/hooks/useActiveTermContext";
import { FloatingContainer } from "../common/FloatingContainer/FloatingContainer";
import { useTermQuery } from "../../../term/hooks/useTermQuery";
import { PagePane } from "../PagePane/PagePane";
import { useBookQuery } from "../../hooks/useBookQuery";
import { useView } from "../../hooks/useView";
import classes from "./DefaultView.module.css";

const ThemeForm = lazy(
  () => import("../../../settings/components/ThemeForm/ThemeForm")
);
const BulkTermForm = lazy(
  () => import("../../../term/components/BulkTermForm/BulkTermForm")
);

export function DefaultView() {
  const { view } = useView();
  const { data: book } = useBookQuery();
  const { data: term, isFetching } = useTermQuery();
  const secondaryView = useSecondaryView();
  const { activeTerm } = useActiveTermContext();
  const show = view === "default";
  const showTranslationPane = secondaryView === "translation" && term;
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
              <Transition transition="slide-down" mounted={show}>
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
                showTranslationPane && <TranslationPane term={term} />
              )}

              {showBulkTermForm && activeTerm?.type === "select" && (
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
