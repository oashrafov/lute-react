import { Box, ScrollArea, Transition } from "@mantine/core";
import { DefaultHeader } from "./components/DefaultHeader/DefaultHeader";
import { HorizontalPanels } from "./components/ResizablePanels/HorizontalPanels";
import { FloatingContainer } from "../common/FloatingContainer/FloatingContainer";
import { TermPane } from "./components/TermPane";
import { TheTextContainer } from "../TheTextContainer/TheTextContainer";
import { ContextMenuArea } from "../ContextMenuArea/ContextMenuArea";
import { useBookQuery } from "../../hooks/useBookQuery";
import { useView } from "../../hooks/useView";
import classes from "./DefaultView.module.css";

export function DefaultView() {
  const { view } = useView();
  const { data: book } = useBookQuery();
  const show = view === "default";

  return (
    <FloatingContainer show={show}>
      <HorizontalPanels
        leftPanel={
          <Box className={classes.paneLeft}>
            <Transition transition="slide-down" mounted={show}>
              {(styles) => (
                <Box style={styles}>
                  <DefaultHeader book={book} />
                </Box>
              )}
            </Transition>
            <ScrollArea type="scroll" flex={1}>
              <ContextMenuArea>
                <TheTextContainer />
              </ContextMenuArea>
            </ScrollArea>
          </Box>
        }
        rightPanel={<TermPane />}
      />
    </FloatingContainer>
  );
}
