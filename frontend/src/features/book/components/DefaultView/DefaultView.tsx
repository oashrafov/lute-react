import { Box, Transition } from "@mantine/core";
import { DefaultHeader } from "./components/DefaultHeader/DefaultHeader";
import { HorizontalPanels } from "./components/ResizablePanels/HorizontalPanels";
import { FloatingContainer } from "../common/FloatingContainer/FloatingContainer";
import { PagePane } from "../PagePane/PagePane";
import { TermPane } from "./components/TermPane";
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
            <PagePane />
          </Box>
        }
        rightPanel={<TermPane />}
      />
    </FloatingContainer>
  );
}
