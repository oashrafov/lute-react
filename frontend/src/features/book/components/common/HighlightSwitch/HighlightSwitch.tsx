import { useTransition } from "react";
import { IconHighlight } from "@tabler/icons-react";
import { ModeSwitch } from "../ModeSwitch/ModeSwitch";
import { handleSetHighlights } from "../../../../../helpers/page";
import { usePageContext } from "../../../hooks/usePageContext";

export function HighlightsSwitch() {
  const { state, dispatch } = usePageContext();
  const [, startTransition] = useTransition();

  return (
    <ModeSwitch
      label="Highlights"
      icon={IconHighlight}
      checked={state.highlights}
      onChange={(e) =>
        startTransition(() =>
          handleSetHighlights(Boolean(e.currentTarget.checked), dispatch)
        )
      }
    />
  );
}
