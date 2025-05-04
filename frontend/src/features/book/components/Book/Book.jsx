import { lazy, Suspense, useEffect, useRef, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mantine/core";
import { userLanguageQuery } from "@language/api/query";
import { getTermQuery } from "@term/api/query";
import { getBookQuery } from "../../api/query";
import PageSpinner from "@common/PageSpinner/PageSpinner";
import TranslationPane from "../TranslationPane/TranslationPane";
import ReadPane from "../ReadPane/ReadPane";
import EditPane from "../EditPane/EditPane";
import FocusPane from "../FocusPane/FocusPane";
import HorizontalPanels from "../HorizontalPanels";
import ContextMenu from "../ContextMenu/ContextMenu";
import useNavigationProgress from "@hooks/useNavigationProgress";
import useDocumentTitle from "@hooks/useDocumentTitle";
import useSetupShortcuts from "../../hooks/useSetupShortcuts";
import usePrefetchPages from "@book/hooks/usePrefetchPages";
import useMarkAsStale from "@book/hooks/useMarkAsStale";
import {
  resetFocusActiveSentence,
  startHoverMode,
} from "@actions/interactions-desktop";
import { BookContext } from "@book/store/bookContext";

const ThemeForm = lazy(
  () => import("@settings/components/ThemeForm/ThemeForm")
);
const BulkTermForm = lazy(
  () => import("@term/components/BulkTermForm/BulkTermForm")
);

function Book({ themeFormOpen, onThemeFormOpen, onDrawerOpen }) {
  const { state, dispatch } = useContext(BookContext);
  const { id, page: pageNum } = useParams();
  const [params] = useSearchParams();
  const editMode = params.get("edit") === "true";
  const normalMode = !editMode && !state.focusMode;

  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });
  const [activeTab, setActiveTab] = useState("0");
  const contextMenuAreaRef = useRef(null);

  const key =
    activeTerm &&
    activeTerm.type !== "shift" &&
    (activeTerm.type === "multi"
      ? `${activeTerm.data}/${activeTerm.langID}`
      : activeTerm.data);

  const { data: book } = useQuery(getBookQuery(id));
  const { data: language } = useQuery(userLanguageQuery(book.languageId));
  const { data: term, isFetching } = useQuery(getTermQuery(key));

  useDocumentTitle(`Reading "${book.title}"`);
  useNavigationProgress();
  useSetupShortcuts(dispatch, language, setActiveTerm, onThemeFormOpen);
  usePrefetchPages(id, pageNum, book.pageCount);
  useMarkAsStale(id);

  const showTranslationPane =
    activeTerm.data && activeTerm.type !== "shift" && term && !themeFormOpen;
  const showBulkTermForm = activeTerm.type === "shift" && !themeFormOpen;
  const showThemeForm = themeFormOpen && !editMode;
  const translationPaneLoading =
    isFetching && !(showBulkTermForm || showThemeForm);
  const textDirection = language.right_to_left ? "rtl" : "ltr";

  useEffect(() => {
    if (!activeTerm.data) {
      resetFocusActiveSentence();
      startHoverMode();
    }
  }, [activeTerm.data]);

  const leftPanel = (
    <ReadPane
      book={book}
      onDrawerOpen={onDrawerOpen}
      onSetActiveTerm={setActiveTerm}
      activeTerm={activeTerm}
      textDirection={textDirection}
      contextMenuAreaRef={contextMenuAreaRef}
    />
  );

  const rightPanel = (
    <>
      {translationPaneLoading ? (
        <PageSpinner />
      ) : (
        showTranslationPane && (
          <TranslationPane
            term={term}
            language={language}
            activeTab={activeTab}
            onSetActiveTab={setActiveTab}
            onSetActiveTerm={setActiveTerm}
          />
        )
      )}

      {showBulkTermForm && (
        <Box p={20} h="100%">
          <Suspense fallback={<PageSpinner />}>
            <BulkTermForm terms={activeTerm.data} />
          </Suspense>
        </Box>
      )}

      {showThemeForm && (
        <Box p={20} h="100%">
          <Suspense fallback={<PageSpinner />}>
            <ThemeForm onClose={() => onThemeFormOpen(false)} />
          </Suspense>
        </Box>
      )}
    </>
  );

  return (
    <>
      {!editMode && <ContextMenu contextMenuAreaRef={contextMenuAreaRef} />}

      {editMode && <EditPane book={book} textDirection={textDirection} />}

      <FocusPane
        book={book}
        language={language}
        term={term}
        onSetActiveTerm={setActiveTerm}
        showTranslationPane={showTranslationPane}
        activeTab={activeTab}
        onSetActiveTab={setActiveTab}
      />

      {normalMode && (
        <HorizontalPanels leftPanel={leftPanel} rightPanel={rightPanel} />
      )}
    </>
  );
}

export default Book;
