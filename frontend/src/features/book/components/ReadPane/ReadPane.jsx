import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { ScrollArea, Title } from "@mantine/core";
import PageHeader from "./components/PageHeader/PageHeader";
import Player from "./components/Player/Player";
import Toolbar from "./components/Toolbar/Toolbar";
import TheText from "./components/TheText/TheText";
import { handleClickOutside } from "@actions/interactions-desktop";
import EditTheText from "./components/EditTheText/EditTheText";
import EditHeader from "./components/EditHeader/EditHeader";
import { getPageQuery } from "../../api/query";
import classes from "../Book/Book.module.css";

function ReadPane({
  book,
  state,
  dispatch,
  activeTerm,
  onSetActiveTerm,
  onDrawerOpen,
  isRtl,
  contextMenuAreaRef,
}) {
  const { id, page: pageNum } = useParams();
  const { data: page } = useQuery(getPageQuery(id, pageNum));
  const [params, setParams] = useSearchParams();

  const editMode = params.get("edit") === "true";

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

  return (
    <>
      <div style={{ position: "relative" }}>
        {!editMode && (
          <>
            <PageHeader
              book={book}
              onDrawerOpen={onDrawerOpen}
              focusMode={state.focusMode}
              highlights={state.highlights}
              onSetActiveTerm={onSetActiveTerm}
              dispatch={dispatch}
            />
            {book.audio && <Player book={book} />}
            <Toolbar state={state} dispatch={dispatch} />
          </>
        )}
        {editMode && (
          <EditHeader book={book} page={pageNum} onSetEdit={setParams} />
        )}
      </div>
      <ScrollArea
        type="scroll"
        ref={contextMenuAreaRef}
        flex={1}
        onMouseDown={(e) => {
          const res = handleClickOutside(e);
          if (!res) return;
          onSetActiveTerm(res);
        }}>
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className={textContainerClass.replace(/\s+/g, " ")}
          style={textContainerStyle}>
          {!editMode && (
            <>
              {Number(pageNum) === 1 && (
                <Title className={classes.title}>{book.title}</Title>
              )}
              <TheText
                paragraphs={page.paragraphs}
                onSetActiveTerm={onSetActiveTerm}
              />
            </>
          )}
          {editMode && <EditTheText text={page.text} />}
        </div>
      </ScrollArea>
    </>
  );
}

export default ReadPane;
