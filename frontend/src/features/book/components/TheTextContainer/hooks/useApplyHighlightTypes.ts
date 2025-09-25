import { useEffect } from "react";
import type {
  HighlightType,
  WordElement,
} from "../../../../../resources/types";
import { TEXTITEM_DATASET } from "../../../../../resources/constants";
import { getFromLocalStorage } from "../../../../../utils/utils";

export function useApplyHighlightTypes() {
  useEffect(() => {
    Object.entries(getFromLocalStorage("Lute.highlightType", {})).map(
      ([, value]) =>
        document
          .querySelectorAll<WordElement>(
            `[data-${TEXTITEM_DATASET.status}="${value}"]`
          )
          .forEach(
            (word) => (word.dataset.highlightType = value as HighlightType)
          )
    );
  }, []);
}
