import { useCallback, useMemo, type MouseEvent } from "react";
import { Box, LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { clsx } from "clsx";
import { TheText } from "../TheText/TheText";
import { useActiveTermContext } from "../../../term/hooks/useActiveTermContext";
import { useBookQuery } from "../../hooks/useBookQuery";
import { usePageQuery } from "../../hooks/usePageQuery";
import {
  focusActiveSentence,
  handleMouseUp,
} from "../../../../helpers/interactions-desktop";
import { applyTextSettings } from "../../../../helpers/general";
import type { ActiveTerm } from "../../../term/store/activeTermContext";
import type { WordElement } from "../../../../resources/types";
import { textCopied } from "../../resources/notifications";
import { useProcessPage } from "./hooks/useProcessPage";
import { copyToClipboard } from "../../../../utils/utils";

export function TheTextContainer() {
  const { data: book } = useBookQuery();
  const { data: page } = usePageQuery();
  const { activeTerm, setActiveTerm } = useActiveTermContext();
  const pageProcessed = useProcessPage();

  const textContainerClass = clsx("textcontainer", {
    "term-active": activeTerm?.data && activeTerm.type !== "select",
  });

  const handleSelectEnd = useCallback(
    async (e: MouseEvent<WordElement>) => {
      if (e.button !== 0) return;

      function handleSetTerm(termData: ActiveTerm) {
        // do nothing with the form
        if (!termData || termData.type === "copy") return;
        setActiveTerm(termData);
        // do not focus sentence when in bulk edit mode
        if (termData.data && termData.type !== "select") {
          focusActiveSentence(termData.textitems);
        }
      }

      const termData = handleMouseUp(e);

      if (!termData) return;
      handleSetTerm(termData);

      if (termData.type !== "copy") return;
      const text = await copyToClipboard(termData.data);
      if (text) {
        notifications.show(textCopied(termData.data));
      }
    },
    [setActiveTerm]
  );

  const theText = useMemo(
    () => (
      <TheText paragraphs={page.paragraphs} onSelectEnd={handleSelectEnd} />
    ),
    [handleSelectEnd, page.paragraphs]
  );

  return (
    <Box
      pos="relative"
      dir={book.textDirection}
      className={textContainerClass}
      ref={applyTextSettings}>
      <LoadingOverlay visible={!pageProcessed} zIndex={199} />
      {theText}
    </Box>
  );
}
