import { useCallback, useMemo, type CSSProperties } from "react";
import { useParams } from "react-router-dom";
import { Title } from "@mantine/core";
import { clsx } from "clsx";
import { TheText } from "../../TheText/TheText";
import { usePageContext } from "../../../hooks/usePageContext";
import { useActiveTermContext } from "../../../../term/hooks/useActiveTermContext";
import { useBookQuery } from "../../../hooks/useBookQuery";
import { usePageQuery } from "../../../hooks/usePageQuery";
import { focusActiveSentence } from "../../../../../helpers/interactions-desktop";
import type { ActiveTerm } from "../../../../term/store/activeTermContext";

export function TheTextContainer() {
  const { data: book } = useBookQuery();
  const { data: page } = usePageQuery();
  const { page: pageNum } = useParams();
  const { state } = usePageContext();
  const { activeTerm, setActiveTerm } = useActiveTermContext();

  const textContainerClass = clsx("textcontainer", {
    "highlight": state.highlights,
    "term-active": activeTerm?.data && activeTerm.type !== "select",
  });

  const textContainerStyle = {
    "--lute-text-font-size": `${state.fontSize}rem`,
    "--lute-text-column-count": state.columnCount,
    "--lute-text-line-height": `${state.lineHeight}px`,
  } as CSSProperties;

  const handleSetTerm = useCallback(
    (termData: ActiveTerm) => {
      // do nothing with the form
      if (!termData || termData.type === "copy") return;
      setActiveTerm(termData);
      // do not focus sentence when in bulk edit mode
      if (termData.data && termData.type !== "select") {
        focusActiveSentence(termData.textitems);
      }
    },
    [setActiveTerm]
  );

  const text = useMemo(
    () => (
      <TheText paragraphs={page.paragraphs} onSetActiveTerm={handleSetTerm} />
    ),
    [handleSetTerm, page.paragraphs]
  );

  return (
    <div
      dir={book.textDirection}
      className={textContainerClass}
      style={textContainerStyle}>
      {Number(pageNum) === 1 && (
        <Title size={22} mb={14} style={{ overflowWrap: "break-word" }}>
          {book.title}
        </Title>
      )}
      {/* <TheText key={pageNum} paragraphs={page.paragraphs} /> */}
      {text}
    </div>
  );
}
