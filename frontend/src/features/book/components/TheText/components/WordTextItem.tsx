import type { ComponentProps } from "react";
import {
  handleMouseDown,
  handleMouseOver,
  handleMouseOut,
} from "#helpers/interactions-desktop";
import { TermPopup } from "#term/components/TermPopup/TermPopup";
import { TextItem } from "./TextItem";
import type { WordTextitem } from "#book/api/types";

interface WordTextItemProps extends ComponentProps<typeof TextItem> {
  data: WordTextitem;
}

export function WordTextItem({ data, ...props }: WordTextItemProps) {
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
