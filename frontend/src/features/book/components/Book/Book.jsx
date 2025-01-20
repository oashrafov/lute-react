import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Center, Group, Loader } from "@mantine/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { definedLangInfoQuery } from "@language/api/language";
import { termDataQuery } from "@term/api/term";
import { paneResizeStorage } from "@actions/utils";
import TranslationPane from "../TranslationPane/TranslationPane";
import ReadPane from "../ReadPane/ReadPane";
import { getBookQuery, getPageQuery } from "../../api/query";
import useNavigationProgress from "../../hooks/useNavigationProgress";
import useSetupShortcuts from "../../hooks/useSetupShortcuts";
import useBookState from "../../hooks/useBookState";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import classes from "./Book.module.css";

const ThemeForm = lazy(
  () => import("@settings/components/ThemeForm/ThemeForm")
);
const BulkTermForm = lazy(
  () => import("@term/components/BulkTermForm/BulkTermForm")
);

function Book({ themeFormOpen, onThemeFormOpen, onDrawerOpen }) {
  const queryClient = useQueryClient();

  const { id, page: pageNum } = useParams();
  const [params] = useSearchParams();
  const editMode = params.get("edit") === "true";

  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });
  const [activeTab, setActiveTab] = useState("0");

  const key =
    activeTerm &&
    activeTerm.type !== "shift" &&
    (activeTerm.type === "multi"
      ? `${activeTerm.data}/${activeTerm.langID}`
      : activeTerm.data);

  const { data: book } = useQuery(getBookQuery(id));
  const { data: page } = useQuery(getPageQuery(id, pageNum));
  const { data: language } = useQuery(definedLangInfoQuery(book.languageId));
  const { data: term } = useQuery(termDataQuery(key));

  const [state, dispatch] = useBookState();
  useDocumentTitle(book);
  useNavigationProgress(book);
  useSetupShortcuts(dispatch, language, setActiveTerm, onThemeFormOpen);

  const showTranslationPane =
    activeTerm.data && activeTerm.type !== "shift" && term && !themeFormOpen;
  const showBulkTermForm = activeTerm.type === "shift" && !themeFormOpen;
  const showThemeForm = themeFormOpen && !editMode;

  const paneRightRef = useRef(null);

  useEffect(() => {
    const nextPage = Number(pageNum) + 1;
    const prevPage = Number(pageNum) - 1;

    if (nextPage <= book.pageCount) {
      queryClient.prefetchQuery(getPageQuery(id, String(nextPage)));
    }
    if (prevPage >= 1) {
      queryClient.prefetchQuery(getPageQuery(id, String(prevPage)));
    }
  }, [book.pageCount, id, pageNum, queryClient]);

  return (
    <PanelGroup
      className="readpage"
      autoSaveId="Lute.horizontalSize"
      direction="horizontal"
      storage={paneResizeStorage}>
      <Panel
        order={1}
        defaultSize={50}
        minSize={30}
        className={classes.paneLeft}>
        <ReadPane
          book={book}
          page={page}
          isRtl={language.isRightToLeft}
          state={state}
          dispatch={dispatch}
          activeTerm={activeTerm}
          onSetActiveTerm={setActiveTerm}
          onDrawerOpen={onDrawerOpen}
        />
      </Panel>

      {!state.focusMode && (
        <>
          <PanelResizeHandle
            hitAreaMargins={{ coarse: 10, fine: 10 }}
            className={classes.resizeHandle}
            onDoubleClick={() => {
              const panel = paneRightRef.current;
              if (panel)
                panel.getSize() < 15 ? panel.resize(50) : panel.resize(5);
            }}
          />

          <Panel
            ref={paneRightRef}
            defaultSize={50}
            order={2}
            collapsible={true}
            minSize={5}>
            {showTranslationPane && (
              <TranslationPane
                term={term}
                language={language}
                activeTab={activeTab}
                onSetActiveTab={setActiveTab}
                onSetActiveTerm={setActiveTerm}
              />
            )}
            {showBulkTermForm && (
              <Box p={20}>
                <Suspense
                  fallback={
                    <Center>
                      <Loader />
                    </Center>
                  }>
                  <BulkTermForm terms={activeTerm.data} />
                </Suspense>
              </Box>
            )}
            {showThemeForm && (
              <Group justify="center" align="center" h="100%" p={10}>
                <Suspense fallback={<Loader />}>
                  <ThemeForm onClose={() => onThemeFormOpen(false)} />
                </Suspense>
              </Group>
            )}
          </Panel>
        </>
      )}
    </PanelGroup>
  );
}

export default Book;
