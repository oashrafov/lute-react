import { useState } from "react";
import FocusTermForm from "./components/FocusTermForm/FocusTermForm";
import FocusPageTurner from "./components/FocusPageTurner/FocusPageTurner";
import FocusToolbar from "./components/FocusToolbar/FocusToolbar";
import FocusHeader from "./components/FocusHeader/FocusHeader";
import FocusDictTabs from "./components/FocusDictTabs/FocusDictTabs";

function FocusPane({
  book,
  language,
  term,
  state,
  dispatch,
  onSetActiveTerm,
  showTranslationPane,
  activeTab,
  onSetActiveTab,
}) {
  const [showDicts, setShowDicts] = useState(false);

  return (
    <>
      <FocusHeader
        book={book}
        state={state}
        dispatch={dispatch}
        show={state.focusMode}
      />

      <FocusToolbar
        book={book}
        focusMode={state.focusMode}
        highlights={state.highlights}
        state={state}
        dispatch={dispatch}
        onShowDicts={setShowDicts}
        showDicts={showDicts}
      />

      <FocusTermForm
        term={term}
        language={language}
        onSetActiveTerm={onSetActiveTerm}
        show={state.focusMode && showTranslationPane}
      />

      <FocusDictTabs
        termText={term?.text}
        language={language}
        activeTab={activeTab}
        onSetActiveTab={onSetActiveTab}
        show={state.focusMode && showTranslationPane && showDicts}
      />

      <FocusPageTurner
        book={book}
        show={state.focusMode && !showTranslationPane}
      />
    </>
  );
}

export default FocusPane;
