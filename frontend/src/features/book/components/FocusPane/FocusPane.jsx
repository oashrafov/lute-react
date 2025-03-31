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
        show={state.focusMode}
        book={book}
        state={state}
        dispatch={dispatch}
      />

      <FocusToolbar
        show={state.focusMode}
        book={book}
        state={state}
        dispatch={dispatch}
        onShowDicts={setShowDicts}
        showDicts={showDicts}
      />

      <FocusTermForm
        show={state.focusMode && showTranslationPane}
        term={term}
        language={language}
        onSetActiveTerm={onSetActiveTerm}
      />

      <FocusDictTabs
        show={state.focusMode && showTranslationPane && showDicts}
        termText={term?.text}
        language={language}
        activeTab={activeTab}
        onSetActiveTab={onSetActiveTab}
      />

      <FocusPageTurner
        show={state.focusMode && !showTranslationPane}
        book={book}
      />
    </>
  );
}

export default FocusPane;
