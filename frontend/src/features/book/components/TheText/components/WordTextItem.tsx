import type { ComponentProps } from "react";
import type { Textitem } from "#book/api/types";
import {
  handleMouseDown,
  handleMouseOver,
  handleMouseOut,
} from "#helpers/interactions-desktop";
import { TermPopup } from "#term/components/TermPopup/TermPopup";
import { TextItem } from "./TextItem";

interface WordTextItem extends ComponentProps<typeof TextItem> {
  data: Textitem;
}

export function WordTextItem({ data, ...props }: WordTextItem) {
  return (
    <TermPopup id={data.wordId}>
      <TextItem
        {...props}
        data={data}
        onMouseDown={handleMouseDown}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
    </TermPopup>
  );
}
