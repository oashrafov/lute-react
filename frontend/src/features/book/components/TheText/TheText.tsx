import { memo, type MouseEvent } from "react";
import { TextItem } from "./components/TextItem";
import { TermPopup } from "#term/components/TermPopup/TermPopup";
import {
  handleMouseDown,
  handleMouseOver,
  hoverOut,
} from "#helpers/interactions-desktop";
import type { Paragraph } from "#book/api/types";
import type { WordElement } from "#resources/types";

interface TheText {
  paragraphs: Paragraph[];
  onSelectEnd: (e: MouseEvent<WordElement>) => Promise<void>;
}

export const TheText = memo(function TheText({
  paragraphs,
  onSelectEnd,
}: TheText) {
  return (
    <div className="thetext">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="textparagraph">
          {paragraph.map((sentence, index) => (
            <span key={`sent_${index + 1}`} id={`sent_${index + 1}`}>
              {sentence.map((textitem) =>
                textitem.isWord ? (
                  <TermPopup id={textitem.wordId} key={textitem.id}>
                    <TextItem
                      data={textitem}
                      onMouseDown={handleMouseDown}
                      onMouseUp={onSelectEnd}
                      onMouseOver={handleMouseOver}
                      onMouseOut={hoverOut}
                    />
                  </TermPopup>
                ) : (
                  <TextItem data={textitem} key={textitem.id} />
                )
              )}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
});
