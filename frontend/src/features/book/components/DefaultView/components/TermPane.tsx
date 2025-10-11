import { Box, LoadingOverlay } from "@mantine/core";
import { TranslationPane } from "./TranslationPane/TranslationPane";
import { lazy, Suspense } from "react";
import { PageSpinner } from "../../../../../components/common/PageSpinner/PageSpinner";
import { useTermQuery } from "../../../../term/hooks/useTermQuery";
import { useBookContext } from "../../../hooks/useBookContext";
import { useActiveTermContext } from "../../../../term/hooks/useActiveTermContext";

const ThemeForm = lazy(
  () => import("../../../../settings/components/ThemeForm/ThemeForm")
);
const BulkTermForm = lazy(
  () => import("../../../../term/components/BulkTermForm/BulkTermForm")
);

export function TermPane() {
  const { data: term, isFetching } = useTermQuery();
  const { themeForm } = useBookContext();
  const { activeTerm } = useActiveTermContext();
  const isSelectionMode = activeTerm?.type === "select";
  const isTermActive =
    term && (activeTerm?.type === "single" || activeTerm?.type === "multi");
  const showThemeForm = themeForm.isOpen;
  const showTranslationPane = isTermActive && !showThemeForm;
  const showBulkTermForm = isSelectionMode && !showThemeForm;

  return (
    <Box pos="relative" h="100%">
      <LoadingOverlay visible={isFetching} />
      {showTranslationPane && <TranslationPane term={term} />}

      {showBulkTermForm && (
        <Suspense fallback={<PageSpinner />}>
          <Box p={20}>
            <BulkTermForm terms={activeTerm.data} />
          </Box>
        </Suspense>
      )}

      {showThemeForm && (
        <Suspense fallback={<PageSpinner />}>
          <Box p={20}>
            <ThemeForm />
          </Box>
        </Suspense>
      )}
    </Box>
  );
}
