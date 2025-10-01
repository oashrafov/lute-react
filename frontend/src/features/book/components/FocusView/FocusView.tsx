import { useState } from "react";
import { Box, Paper, Transition } from "@mantine/core";
import { FocusPageControls } from "./components/FocusPageControls/FocusPageControls";
import { FocusToolbar } from "./components/FocusToolbar/FocusToolbar";
import { FocusHeader } from "./components/FocusHeader/FocusHeader";
import { FloatingContainer } from "../common/FloatingContainer/FloatingContainer";
import { DictTabs } from "../../../language/components/DictTabs/DictTabs";
import { PagePane } from "../PagePane/PagePane";
import { FOCUS_HEADER_HEIGHT } from "../../../../resources/constants";
import { useSecondaryView } from "../../hooks/useSecondaryView";
import { useView } from "../../hooks/useView";
import { TermForm } from "../../../term/components/TermForm/TermForm";
import { useBookQuery } from "../../hooks/useBookQuery";
import { useTermQuery } from "../../../term/hooks/useTermQuery";
import { useUserLanguageQuery } from "../../../language/hooks/useUserLanguageQuery";

export function FocusView() {
  const { view } = useView();
  const { data: book } = useBookQuery();
  const { data: term } = useTermQuery();
  const { data: language } = useUserLanguageQuery(book.languageId);

  const show = view === "focus";
  const secondaryView = useSecondaryView();
  const showTranslationPane = secondaryView === "translation" && term;
  const [showDicts, setShowDicts] = useState(false);

  return (
    <>
      <FloatingContainer transition="slide-down" show={show} w="100%">
        <FocusHeader book={book} />
      </FloatingContainer>

      <Transition transition="fade" mounted={show}>
        {(styles) => (
          <Box style={{ ...styles, marginTop: FOCUS_HEADER_HEIGHT }}>
            <PagePane />
          </Box>
        )}
      </Transition>

      <FloatingContainer
        show={show}
        position={{ top: 100, left: 20 }}
        transition="slide-right">
        <FocusToolbar
          book={book}
          onShowDicts={setShowDicts}
          showDicts={showDicts}
        />
      </FloatingContainer>

      <FloatingContainer
        show={!!(show && showTranslationPane)}
        position={{ top: 100, right: 20 }}
        transition="slide-left">
        <Paper shadow="sm" p={10} w={300} withBorder>
          {term && <TermForm term={term} language={language} />}
        </Paper>
      </FloatingContainer>

      <FloatingContainer
        show={!!(show && showTranslationPane && showDicts)}
        position={{ bottom: 20, left: 20 }}
        transition="slide-right">
        <Paper shadow="sm" p={10} w={800} withBorder h={500}>
          {term?.text && <DictTabs termText={term.text} language={language} />}
        </Paper>
      </FloatingContainer>

      <FocusPageControls book={book} show={show && !showTranslationPane} />
    </>
  );
}
