import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ScrollArea, Title, Transition } from "@mantine/core";
import ReadHeader from "./components/ReadHeader/ReadHeader";
import TheText from "./components/TheText/TheText";
import { hasClickedOutsideText } from "@actions/interactions-desktop";
import { removeAllMarkings } from "@actions/utils";
import { getPageQuery } from "../../api/query";
import classes from "../Book/Book.module.css";

function ReadPane({
  book,
  state,
  dispatch,
  activeTerm,
  onSetActiveTerm,
  onDrawerOpen,
  textDirection,
  contextMenuAreaRef,
}) {
  const { id, page: pageNum } = useParams();
  const { data: page } = useQuery(getPageQuery(id, pageNum));

  let headerHeight = 80;
  if (book.audio && !state.focusMode) headerHeight += 37;

  const textContainerClass = `textcontainer
                              ${state.highlights ? "highlight" : ""}
                              ${activeTerm.data && activeTerm.type !== "shift" ? "term-active" : ""}`;

  const textContainerStyle = {
    "--lute-text-font-size": `${state.fontSize}rem`,
    "--lute-text-column-count": state.columnCount,
    "--lute-text-line-height": `${state.lineHeight}px`,
    "width": `${state.focusMode ? state.textWidth : 100}%`,
    "marginInline": state.focusMode && "auto",
  };

  function handleClickOutside(e) {
    const res = hasClickedOutsideText(e);
    if (!res) return;

    removeAllMarkings();
    onSetActiveTerm({ data: null });
  }

  return (
    <>
      <div style={{ height: `${headerHeight}px` }}>
        <Transition transition="slide-down" mounted={!state.focusMode}>
          {(styles) => (
            <div style={styles}>
              <ReadHeader
                book={book}
                onDrawerOpen={onDrawerOpen}
                focusMode={state.focusMode}
                highlights={state.highlights}
                onSetActiveTerm={onSetActiveTerm}
                state={state}
                dispatch={dispatch}
              />
            </div>
          )}
        </Transition>
      </div>

      <ScrollArea
        type="scroll"
        ref={contextMenuAreaRef}
        flex={1}
        onMouseDown={handleClickOutside}>
        <div
          dir={textDirection}
          className={textContainerClass.replace(/\s+/g, " ")}
          style={textContainerStyle}>
          {Number(pageNum) === 1 && (
            <Title className={classes.title}>{book.title}</Title>
          )}
          <TheText
            key={pageNum}
            paragraphs={page.paragraphs}
            onSetActiveTerm={onSetActiveTerm}
          />
        </div>
      </ScrollArea>
    </>
  );
}

export default ReadPane;
