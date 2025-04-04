import { memo, useRef } from "react";
import { Box, ScrollAreaAutosize, Stack } from "@mantine/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DictTabs from "@language/components/DictTabs/DictTabs";
import TermForm from "@term/components/TermForm/TermForm";
import { paneResizeStorage } from "@actions/utils";
import classes from "../Book/Book.module.css";

function TranslationPane({
  term,
  language,
  onSetActiveTerm,
  onSetActiveTab,
  activeTab,
}) {
  const termPanelRef = useRef();
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
    <Stack gap={0} dir="column" className={classes.translationContainer}>
      <PanelGroup
        direction="vertical"
        autoSaveId="Lute.verticalSize"
        storage={paneResizeStorage}>
        <Panel order={1} defaultSize={40} ref={termPanelRef}>
          {/* need key to recreate the form */}
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
        </Panel>

        <PanelResizeHandle
          hitAreaMargins={{ coarse: 10, fine: 10 }}
          className={classes.resizeHandle}
          onDoubleClick={() => {
            const panel = termPanelRef.current;
            if (panel) {
              panel.getSize() < 15 ? panel.resize(40) : panel.resize(5);
            }
          }}
        />
        <Panel
          order={1}
          defaultSize={60}
          minSize={20}
          collapsible
          collapsedSize={0}
          className={classes.dictTabsContainer}>
          <DictTabs
            termText={term.text}
            language={language}
            onReturnFocusToForm={handleReturnFocusToForm}
            onSetActiveTab={onSetActiveTab}
            activeTab={activeTab}
          />
        </Panel>
      </PanelGroup>
    </Stack>
  );
}

export default memo(TranslationPane);
