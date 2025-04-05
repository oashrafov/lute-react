import { handleSetHighlights } from "@actions/page";
import { IconHighlight } from "@tabler/icons-react";
import ModeSwitch from "../ModeSwitch/ModeSwitch";

function HighlightsSwitch({ checked, dispatch }) {
  return (
    <ModeSwitch
      label="Highlights"
      icon={IconHighlight}
      checked={checked}
      onChange={(e) => {
        handleSetHighlights(Boolean(e.currentTarget.checked), dispatch);
      }}
    />
  );
}

export default HighlightsSwitch;
