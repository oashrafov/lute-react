import { getPageQuery } from "@book/api/query";
import { TheText } from "@book/components/TheText/TheText";
import { Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { usePageContext } from "@book/hooks/usePageContext";
import { useActiveTermContext } from "@book/hooks/useActiveTermContext";
import { useBook } from "@book/hooks/useBook";

export function PageContent() {
  const { book, language } = useBook();
  const { id, page: pageNum } = useParams();
  const { data: page } = useQuery(getPageQuery(id, pageNum));
  const { state } = usePageContext();
  const { activeTerm } = useActiveTermContext();
  const textDirection = language.right_to_left ? "rtl" : "ltr";

  const textContainerClass = `textcontainer
                                ${state.highlights ? "highlight" : ""}
                                ${activeTerm.data && activeTerm.type !== "shift" ? "term-active" : ""}`;

  const textContainerStyle = {
    "--lute-text-font-size": `${state.fontSize}rem`,
    "--lute-text-column-count": state.columnCount,
    "--lute-text-line-height": `${state.lineHeight}px`,
  };

  return (
    <div
      dir={textDirection}
      className={textContainerClass.replace(/\s+/g, " ")}
      style={textContainerStyle}>
      {Number(pageNum) === 1 && (
        <Title size="1.4rem" mb="0.9rem" style={{ overflowWrap: "break-word" }}>
          {book.title}
        </Title>
      )}
      <TheText key={pageNum} paragraphs={page.paragraphs} />
    </div>
  );
}
