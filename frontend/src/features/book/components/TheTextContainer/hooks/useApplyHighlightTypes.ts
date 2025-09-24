import { useEffect } from "react";
import type {
  HighlightType,
  TextitemElement,
} from "../../../../../resources/types";
import { TEXTITEM_DATASET } from "../../../../../resources/constants";
import { getFromLocalStorage } from "../../../../../utils/utils";

export function useApplyHighlightTypes() {
  useEffect(() => {
    Object.entries(getFromLocalStorage("Lute.highlightType", {})).map(
      ([, value]) =>
        document
          .querySelectorAll<TextitemElement>(
            `[data-${TEXTITEM_DATASET.status}="${value}"]`
          )
          .forEach(
            (textitem) =>
              (textitem.dataset.highlightType = value as HighlightType)
          )
    );
  }, []);
}
