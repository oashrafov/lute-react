import { useState } from "react";
import { FocusPageControls } from "./components/FocusPageControls/FocusPageControls";
import { FocusToolbar } from "./components/FocusToolbar/FocusToolbar";
import { FocusHeader } from "./components/FocusHeader/FocusHeader";
import { Paper, Transition } from "@mantine/core";
import { FloatingContainer } from "../common/FloatingContainer/FloatingContainer";
import { DictTabs } from "@language/components/DictTabs/DictTabs";
import { usePageContext } from "@book/hooks/usePageContext";
import { FOCUS_HEADER_HEIGHT } from "@resources/constants";
import { useBookPanel } from "@book/hooks/useBookPanel";
import { TermForm } from "@term/components/TermForm/TermForm";
import { useBook } from "@book/hooks/useBook";
import { useTerm } from "@book/hooks/useTerm";
import { PagePane } from "../PagePane/PagePane";

export function FocusView({ show }) {
  const { book, language } = useBook();
  const { data: term } = useTerm();
  const { state } = usePageContext();
  const { secondaryView } = useBookPanel(term);
  const showTranslationPane = secondaryView === "translation";
  const [showDicts, setShowDicts] = useState(false);

  return (
    <>
      <FloatingContainer transition="slide-down" show={show} w="100%">
        <FocusHeader book={book} />
      </FloatingContainer>

      <Transition transition="fade" mounted={show} duration={300} keepMounted>
        {(styles) => (
          <PagePane
            containerStyles={{
              ...styles,
              paddingInline: `${(100 - state.textWidth) * 0.5}%`,
              marginTop: FOCUS_HEADER_HEIGHT,
            }}
          />
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
        show={show && showTranslationPane}
        position={{ top: 100, right: 20 }}
        transition="slide-left">
        <Paper shadow="sm" p={10} w={300} withBorder>
          {term && <TermForm term={term} language={language} />}
        </Paper>
      </FloatingContainer>

      <FloatingContainer
        show={show && showTranslationPane && showDicts}
        position={{ bottom: 20, left: 20 }}
        transition="slide-right">
        <Paper shadow="sm" p={10} w={800} withBorder h={500}>
          {term?.text && <DictTabs language={language} termText={term.text} />}
        </Paper>
      </FloatingContainer>

      <FocusPageControls book={book} show={show && !showTranslationPane} />
    </>
  );
}
