import { useCallback, type MouseEventHandler } from "react";
import { Box, LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import TextItem from "./components/TextItem";
import { TermPopup } from "../../../term/components/TermPopup/TermPopup";
import { copyToClipboard } from "../../../../utils/utils";
import { useInitializePage } from "./hooks/useInitializePage";
import { useProcessPage } from "./hooks/useProcessPage";
import { textCopied } from "../../resources/notifications";
import {
  handleMouseDown,
  handleMouseOver,
  handleMouseUp,
  hoverOut,
} from "../../../../helpers/interactions-desktop";
import type { Paragraph } from "../../api/types";
import type { ActiveTerm } from "../../../term/store/activeTermContext";
import type { WordTextItemElement } from "../../../../resources/types";

interface TheText {
  paragraphs: Paragraph[];
  onSetActiveTerm: (termData: ActiveTerm) => void;
}

export function TheText({ paragraphs, onSetActiveTerm }: TheText) {
  useInitializePage();
  const pageProcessed = useProcessPage();

  const handleSelectStart: MouseEventHandler<WordTextItemElement> = useCallback(
    (e) => {
      // trigger only with lmb
      if (e.button !== 0) return;
      handleMouseDown(e);
    },
    []
  );

  const handleSelectEnd: MouseEventHandler<WordTextItemElement> = useCallback(
    async (e) => {
      if (e.button !== 0) return;
      const termData = handleMouseUp(e);

      if (!termData) return;
      onSetActiveTerm(termData);

      if (termData.type !== "copy") return;
      const text = await copyToClipboard(termData.data);
      if (text) {
        notifications.show(textCopied(termData.data));
      }
    },
    [onSetActiveTerm]
  );

  return (
    <Box pos="relative">
      {/* zIndex less than drawer */}
      <LoadingOverlay visible={!pageProcessed} zIndex={199} />
      <div className="thetext">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="textparagraph">
            {paragraph.map((sentence, index) => (
              <span key={`sent_${index + 1}`} id={`sent_${index + 1}`}>
                {sentence.map((textitem) =>
                  textitem.isWord ? (
                    <TermPopup id={textitem.wid} key={textitem.id}>
                      <TextItem
                        data={textitem}
                        onMouseDown={handleSelectStart}
                        onMouseUp={handleSelectEnd}
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
    </Box>
  );
}
