import { useRef } from "react";
import { Box, ScrollAreaAutosize } from "@mantine/core";
import { VerticalPanels } from "../ResizablePanels/VerticalPanels";
import { DictsPane } from "#language/components/DictsPane/DictsPane";
import { useUserLanguageQuery } from "#language/hooks/useUserLanguageQuery";
import { TermInfoPane } from "#book/components/TermInfoPane/TermInfoPane";
import type { TermDetail } from "#term/api/types";
import classes from "./TranslationPane.module.css";

interface TranslationPane {
  term: TermDetail;
}

export function TranslationPane({ term }: TranslationPane) {
  const { data: language } = useUserLanguageQuery();
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
            <TermInfoPane
              key={term.text}
              term={term}
              translationFieldRef={translationFieldRef}
              showPronunciationField={language?.show_romanization}
            />
          </ScrollAreaAutosize>
        }
        bottomPanel={
          <Box display="flex" h="100%">
            <Box className={classes.dictTabsContainer}>
              {language && (
                <DictsPane
                  dictionaries={language.dictionaries.filter(
                    (dict) => dict.for === "terms"
                  )}
                  termText={term.text}
                  onReturnFocusToForm={handleReturnFocusToForm}
                />
              )}
            </Box>
          </Box>
        }
      />
    </div>
  );
}
