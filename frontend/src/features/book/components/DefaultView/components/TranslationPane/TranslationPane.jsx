import { useRef } from "react";
import { Box, ScrollAreaAutosize } from "@mantine/core";
import { VerticalPanels } from "../ResizablePanels/VerticalPanels";
import { DictTabs } from "@language/components/DictTabs/DictTabs";
import { TermForm } from "@term/components/TermForm/TermForm";
import classes from "./TranslationPane.module.css";

export function TranslationPane({ term, language }) {
  const translationFieldRef = useRef();

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
                termText={term.text}
                language={language}
                onReturnFocusToForm={handleReturnFocusToForm}
              />
            </Box>
          </Box>
        }
      />
    </div>
  );
}
