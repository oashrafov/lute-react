// lute\templates\read\page_content.html
import { memo } from "react";
import { Box, LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import TextItem from "./components/TextItem";
import Popup from "@term/components/Popup/Popup";
import {
  focusActiveSentence,
  handleMouseDown,
  handleMouseOver,
  handleMouseUp,
  hoverOut,
} from "@actions/interactions-desktop";
import { copyToClipboard } from "@actions/utils";
import { useInitializePage } from "./hooks/useInitializePage";
import { useProcessPage } from "./hooks/useProcessPage";
import { textCopied } from "@book/resources/notifications";

function TheText({ paragraphs, onSetActiveTerm }) {
  useInitializePage();
  const pageProcessed = useProcessPage();

  function handleSetTerm(termData) {
    // do nothing with the form
    if (!termData || termData.type === "copy") return;
    onSetActiveTerm(termData);
    // do not focus sentence when in bulk edit(shift) mode
    termData.data &&
      termData.type !== "shift" &&
      focusActiveSentence(termData.textitems);
  }

  function handleSelectStart(e) {
    // trigger only with lmb
    if (e.button !== 0) return;
    handleMouseDown(e);
  }

  async function handleSelectEnd(e) {
    if (e.button !== 0) return;
    const termData = handleMouseUp(e);

    if (!termData) return;
    handleSetTerm(termData);

    if (termData.type !== "copy") return;
    const text = await copyToClipboard(termData.data);
    text && notifications.show(textCopied(termData.data));
  }

  return (
    <Box pos="relative">
      {/* zIndex less than drawer */}
      <LoadingOverlay visible={!pageProcessed} zIndex={199} />
      <div className="thetext">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="textparagraph">
            {paragraph.map((sentence, index) => (
              <span
                key={`sent_${index + 1}`}
                id={`sent_${index + 1}`}
                className="textsentence">
                {sentence.map((textitem) =>
                  textitem.isWord ? (
                    <Popup id={textitem.wid} key={textitem.id}>
                      <TextItem
                        data={textitem}
                        onMouseDown={handleSelectStart}
                        onMouseUp={handleSelectEnd}
                        onMouseOver={handleMouseOver}
                        onMouseOut={hoverOut}
                      />
                    </Popup>
                  ) : (
                    // non-word spans
                    <TextItem data={textitem} key={textitem.id} />
                  )
                )}
              </span>
            ))}
            <span className="textitem">{"\u200B"}</span>
          </p>
        ))}
      </div>
    </Box>
  );
}

export default memo(TheText);
