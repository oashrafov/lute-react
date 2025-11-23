import { useRef } from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Box, ScrollAreaAutosize } from "@mantine/core";
import { VerticalPanels } from "../ResizablePanels/VerticalPanels";
import { DictsPane } from "#language/components/DictsPane/DictsPane";
import { query } from "#language/api/query.js";
import { TermForm } from "#term/components/TermForm/TermForm";
import type { TermDetail } from "#term/api/types";
import { useActiveTermContext } from "#term/hooks/useActiveTermContext";
import classes from "./TranslationPane.module.css";

interface TranslationPane {
  term: TermDetail;
}

export function TranslationPane({ term }: TranslationPane) {
  const { langId } = useSearch({ strict: false });
  const { data: language } = useQuery(query.userLanguageDetail(langId));
  const { clearActiveTerm } = useActiveTermContext();
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
                showPronunciation={language?.show_romanization}
                translationFieldRef={translationFieldRef}
                onSubmitSuccess={clearActiveTerm}
              />
            </Box>
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
