import { IconHighlight } from "@tabler/icons-react";
import { ModeSwitch } from "../ModeSwitch/ModeSwitch";
import { handleSetHighlights } from "@actions/page";
import { usePageContext } from "@book/hooks/usePageContext";

export function HighlightsSwitch() {
  const { state, dispatch } = usePageContext();
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
