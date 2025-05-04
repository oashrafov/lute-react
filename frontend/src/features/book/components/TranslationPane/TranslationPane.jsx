import { memo, useRef } from "react";
import { Box, ScrollAreaAutosize } from "@mantine/core";
import VerticalPanels from "../VerticalPanels";
import DictTabs from "@language/components/DictTabs/DictTabs";
import TermForm from "@term/components/TermForm/TermForm";
import classes from "../Book/Book.module.css";

function TranslationPane({
  term,
  language,
  onSetActiveTerm,
  onSetActiveTab,
  activeTab,
}) {
  const translationFieldRef = useRef();

  function handleReturnFocusToForm() {
    setTimeout(() => {
      const input = translationFieldRef?.current;
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 0);
  }

  return (
    <div className={classes.translationContainer}>
      <VerticalPanels
        leftPanel={
          <ScrollAreaAutosize mah="100%">
            <Box p={20}>
              <TermForm
                key={term.text}
                term={term}
                language={language}
                translationFieldRef={translationFieldRef}
                onSetActiveTerm={onSetActiveTerm}
              />
            </Box>
          </ScrollAreaAutosize>
        }
        rightPanel={
          <DictTabs
            termText={term.text}
            language={language}
            onReturnFocusToForm={handleReturnFocusToForm}
            onSetActiveTab={onSetActiveTab}
            activeTab={activeTab}
          />
        }
      />
    </div>
  );
}

export default memo(TranslationPane);
