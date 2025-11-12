import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Paper, ScrollArea, Stack, Transition } from "@mantine/core";
import { FocusPageControls } from "./components/FocusPageControls/FocusPageControls";
import { FocusToolbar } from "./components/FocusToolbar/FocusToolbar";
import { FocusHeader } from "./components/FocusHeader/FocusHeader";
import { FloatingContainer } from "../common/FloatingContainer/FloatingContainer";
import { DictTabs } from "../../../language/components/DictTabs/DictTabs";
import { ContextMenuArea } from "../ContextMenuArea/ContextMenuArea";
import { useView } from "../../hooks/useView";
import { TermForm } from "../../../term/components/TermForm/TermForm";
import { TheTextContainer } from "../TheTextContainer/TheTextContainer";
import { useBookQuery } from "../../hooks/useBookQuery";
import { useTermQuery } from "../../../term/hooks/useTermQuery";
import { useActiveTermContext } from "../../../term/hooks/useActiveTermContext";
import { useBookContext } from "../../hooks/useBookContext";
import { queries } from "../../../language/api/queries";

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
      <Stack gap={0} h="100vh">
        <Transition transition="slide-down" mounted={show}>
          {(styles) => (
            <Box style={styles}>
              <FocusHeader book={book} />
            </Box>
          )}
        </Transition>

        <ScrollArea flex={1}>
          <Transition transition="fade" mounted={show}>
            {(styles) => (
              <Box style={{ ...styles }}>
                <ContextMenuArea>
                  <TheTextContainer />
                </ContextMenuArea>
              </Box>
            )}
          </Transition>
        </ScrollArea>
      </Stack>

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
          {term?.text && language && (
            <DictTabs termText={term.text} language={language} />
          )}
        </Paper>
      </FloatingContainer>

      <FocusPageControls book={book} show={show && !showTranslationPane} />
    </>
  );
}
