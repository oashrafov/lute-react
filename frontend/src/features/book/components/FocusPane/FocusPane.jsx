import { useContext, useState } from "react";
import FocusTermForm from "./components/FocusTermForm/FocusTermForm";
import FocusPageTurner from "./components/FocusPageTurner/FocusPageTurner";
import FocusToolbar from "./components/FocusToolbar/FocusToolbar";
import FocusHeader from "./components/FocusHeader/FocusHeader";
import FocusDictTabs from "./components/FocusDictTabs/FocusDictTabs";
import { BookContext } from "@book/store/bookContext";

function FocusPane({
  book,
  language,
  term,
  onSetActiveTerm,
  showTranslationPane,
  activeTab,
  onSetActiveTab,
}) {
  const { state } = useContext(BookContext);
  const [showDicts, setShowDicts] = useState(false);

  return (
    <>
      <FocusHeader show={state.focusMode} book={book} />

      <FocusToolbar
        show={state.focusMode}
        book={book}
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
