import { useContext } from "react";
import { IconHighlight } from "@tabler/icons-react";
import ModeSwitch from "../ModeSwitch/ModeSwitch";
import { BookContext } from "@book/store/bookContext";
import { handleSetHighlights } from "@actions/page";

function HighlightsSwitch() {
  const { state, dispatch } = useContext(BookContext);
  return (
    <ModeSwitch
      label="Highlights"
      icon={IconHighlight}
      checked={state.highlights}
      onChange={(e) => {
        handleSetHighlights(Boolean(e.currentTarget.checked), dispatch);
      }}
    />
  );
}

export default HighlightsSwitch;
