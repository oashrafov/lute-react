import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Affix, Paper } from "@mantine/core";
import { FocusPageControls } from "./components/FocusPageControls/FocusPageControls";
import { FocusActions } from "./components/FocusActions/FocusActions";
import { FloatingContainer } from "../common/FloatingContainer/FloatingContainer";
import { FocusPagePane } from "./components/FocusPagePane/FocusPagePane";
import { DictsPane } from "#language/components/DictsPane/DictsPane";
import { queries } from "#language/api/queries";
import { TermForm } from "#term/components/TermForm/TermForm";
import { useTermQuery } from "#term/hooks/useTermQuery";
import { useActiveTermContext } from "#term/hooks/useActiveTermContext";
import { useView } from "#book/hooks/useView";
import { useBookQuery } from "#book/hooks/useBookQuery";
import { useBookContext } from "#book/hooks/useBookContext";

export function FocusView() {
  const { view } = useView();
  const { themeForm } = useBookContext();
  const { data: book } = useBookQuery();
  const { data: term } = useTermQuery();
  const { activeTerm } = useActiveTermContext();
  const { data: language } = useQuery(
    queries.userLanguageDetail(book.languageId)
  );
  const [showDicts, setShowDicts] = useState(false);

  const show = view === "focus";
  const isTermActive =
    term && (activeTerm?.type === "single" || activeTerm?.type === "multi");
  const showThemeForm = themeForm.isOpen;
  const showTranslationPane = isTermActive && !showThemeForm;

  return (
    <>
      <FocusPagePane />

      <Affix position={{ top: 100, left: 20 }}>
        <FocusActions
          bookmarks={book.bookmarks}
          onShowDicts={setShowDicts}
          showDicts={showDicts}
        />
      </Affix>

      <FloatingContainer
        show={!!(show && showTranslationPane)}
        position={{ top: 100, right: 20 }}
        transition="slide-left">
        <Paper shadow="sm" p={10} w={300} withBorder>
          {term && <TermForm term={term} />}
        </Paper>
      </FloatingContainer>

      <FloatingContainer
        show={!!(show && showTranslationPane && showDicts)}
        position={{ bottom: 20, left: 20 }}
        transition="slide-right">
        <Paper shadow="sm" p={10} w={800} withBorder h={500}>
          {term?.text && language && (
            <DictsPane
              termText={term.text}
              dictionaries={language.dictionaries.filter(
                (dict) => dict.for === "terms"
              )}
            />
          )}
        </Paper>
      </FloatingContainer>

      <FocusPageControls
        pageCount={book.pageCount}
        show={show && !showTranslationPane}
      />
    </>
  );
}
