import { useEffect } from "react";
import type {
  HighlightType,
  TextItemElement,
} from "../../../../../resources/types";
import { TEXTITEM_DATA } from "../../../../../resources/constants";
import { getFromLocalStorage } from "../../../../../utils/utils";

export function useApplyHighlightTypes() {
  useEffect(() => {
    Object.entries(getFromLocalStorage("Lute.highlightType", {})).map(
      ([, value]) =>
        document
          .querySelectorAll<TextItemElement>(
            `[data-${TEXTITEM_DATA.status}="${value}"]`
          )
          .forEach(
            (textitem) =>
              (textitem.dataset.highlightType = value as HighlightType)
          )
    );
  }, []);
}
