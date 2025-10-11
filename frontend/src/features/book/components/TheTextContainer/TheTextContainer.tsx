import { useCallback, type MouseEvent } from "react";
import { Box, LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { TheText } from "../TheText/TheText";
import { useActiveTermContext } from "../../../term/hooks/useActiveTermContext";
import { useBookQuery } from "../../hooks/useBookQuery";
import { usePageQuery } from "../../hooks/usePageQuery";
import { handleMouseUp } from "../../../../helpers/interactions-desktop";
import { applyTextSettings } from "../../../../helpers/general";
import type { WordElement } from "../../../../resources/types";
import { textCopied } from "../../resources/notifications";
import { useProcessPage } from "./hooks/useProcessPage";
import { copyToClipboard } from "../../../../utils/utils";

export function TheTextContainer() {
  const { data: book } = useBookQuery();
  const { data: page } = usePageQuery();
  const { setActiveTerm, clearActiveTerm } = useActiveTermContext();
  const pageProcessed = useProcessPage();

  const handleSelectEnd = useCallback(
    async (e: MouseEvent<WordElement>) => {
      if (e.button !== 0) return;

      const termData = handleMouseUp(e);
      if (!termData) return;

      if (termData.type === "copy") {
        const text = await copyToClipboard(termData.data);
        if (text) {
          notifications.show(textCopied(termData.data));
        }
      } else {
        if (termData.data === null) {
          clearActiveTerm();
        } else {
          setActiveTerm(termData);
        }
      }
    },
    [clearActiveTerm, setActiveTerm]
  );

  return (
    <Box
      pos="relative"
      dir={book.textDirection}
      className="textcontainer"
      ref={applyTextSettings}>
      <LoadingOverlay visible={!pageProcessed} zIndex={199} />
      <TheText paragraphs={page.paragraphs} onSelectEnd={handleSelectEnd} />
    </Box>
  );
}
