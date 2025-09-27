import { useTransition } from "react";
import { IconHighlight } from "@tabler/icons-react";
import { ModeSwitch } from "../ModeSwitch/ModeSwitch";
import { handleSetHighlights } from "../../../../../helpers/page";
import { getFromLocalStorage } from "../../../../../utils/utils";
import type { LocalStorageItem } from "../../../../../resources/types";

export function HighlightsSwitch() {
  const [, startTransition] = useTransition();

  return (
    <ModeSwitch
      label="Highlights"
      icon={IconHighlight}
      id="highlightsSwitch"
      checked={getFromLocalStorage<LocalStorageItem>("Lute.highlights", true)}
      onChange={(e) =>
        startTransition(() =>
          handleSetHighlights(Boolean(e.currentTarget.checked))
        )
      }
    />
  );
}
