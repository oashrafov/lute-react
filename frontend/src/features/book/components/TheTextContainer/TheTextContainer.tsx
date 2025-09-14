import {
  useCallback,
  useMemo,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { useParams } from "react-router-dom";
import { Box, LoadingOverlay, Title } from "@mantine/core";
import { clsx } from "clsx";
import { TheText } from "../TheText/TheText";
import { usePageContext } from "../../hooks/usePageContext";
import { useActiveTermContext } from "../../../term/hooks/useActiveTermContext";
import { useBookQuery } from "../../hooks/useBookQuery";
import { usePageQuery } from "../../hooks/usePageQuery";
import {
  focusActiveSentence,
  handleMouseUp,
} from "../../../../helpers/interactions-desktop";
import type { ActiveTerm } from "../../../term/store/activeTermContext";
import { useProcessPage } from "./hooks/useProcessPage";
import { useInitializePage } from "./hooks/useInitializePage";
import { copyToClipboard } from "../../../../utils/utils";
import type { WordTextItemElement } from "../../../../resources/types";
import { notifications } from "@mantine/notifications";
import { textCopied } from "../../resources/notifications";

export function TheTextContainer() {
  const { data: book } = useBookQuery();
  const { data: page } = usePageQuery();
  const { page: pageNum } = useParams();
  useInitializePage();
  const { state } = usePageContext();
  const { activeTerm, setActiveTerm } = useActiveTermContext();
  const pageProcessed = useProcessPage();

  const textContainerClass = clsx("textcontainer", {
    "highlight": state.highlights,
    "term-active": activeTerm?.data && activeTerm.type !== "select",
  });

  const textContainerStyle = {
    "--lute-text-font-size": `${state.fontSize}rem`,
    "--lute-text-column-count": state.columnCount,
    "--lute-text-line-height": `${state.lineHeight}px`,
  } as CSSProperties;

  const handleSelectEnd = useCallback(
    async (e: MouseEvent<WordTextItemElement>) => {
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

  const text = useMemo(
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
      style={textContainerStyle}>
      {/* zIndex less than drawer */}
      {Number(pageNum) === 1 && (
        <Title size={22} mb={14} style={{ overflowWrap: "break-word" }}>
          {book.title}
        </Title>
      )}
      <LoadingOverlay visible={!pageProcessed} zIndex={199} />
      {text}
    </Box>
  );
}
