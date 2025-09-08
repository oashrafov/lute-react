import { useRef } from "react";
import { Box, ScrollAreaAutosize } from "@mantine/core";
import { VerticalPanels } from "../ResizablePanels/VerticalPanels";
import { DictTabs } from "../../../../../language/components/DictTabs/DictTabs";
import { TermForm } from "../../../../../term/components/TermForm/TermForm";
import type { TermDetail } from "../../../../../term/api/types";
import { useBookQuery } from "../../../../hooks/useBookQuery";
import { useUserLanguageQuery } from "../../../../../language/hooks/useUserLanguageQuery";
import classes from "./TranslationPane.module.css";

interface TranslationPane {
  term: TermDetail;
}

export function TranslationPane({ term }: TranslationPane) {
  const { data: book } = useBookQuery();
  const { data: language } = useUserLanguageQuery(book.languageId);
  const translationFieldRef = useRef<HTMLTextAreaElement>(null);

  function handleReturnFocusToForm() {
    setTimeout(() => {
      const input = translationFieldRef?.current;
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });
  }

  return (
    <div className={classes.container}>
      <VerticalPanels
        topPanel={
          <ScrollAreaAutosize mah="100%">
            <Box p={20}>
              <TermForm
                key={term.text}
                term={term}
                language={language}
                translationFieldRef={translationFieldRef}
              />
            </Box>
          </ScrollAreaAutosize>
        }
        bottomPanel={
          <Box display="flex" h="100%">
            <Box className={classes.dictTabsContainer}>
              <DictTabs
                language={language}
                termText={term.text}
                onReturnFocusToForm={handleReturnFocusToForm}
              />
            </Box>
          </Box>
        }
      />
    </div>
  );
}
