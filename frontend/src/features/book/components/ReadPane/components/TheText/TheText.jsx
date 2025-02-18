// lute\templates\read\page_content.html
import { memo, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  Box,
  LoadingOverlay,
  Text,
  useComputedColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconClipboardCheck } from "@tabler/icons-react";
import TextItem from "./components/TextItem";
import Popup from "@term/components/Popup/Popup";
import { settingsQuery } from "@settings/api/settings";
import {
  focusActiveSentence,
  handleMouseDown,
  handleMouseOver,
  handleMouseUp,
  hoverOut,
  startHoverMode,
} from "@actions/interactions-desktop";
import { applyLuteHighlights } from "@actions/general";
import { copyToClipboard } from "@actions/utils";
import { commitPage } from "@book/api/api";
import { keys } from "@book/api/keys";

function TheText({ paragraphs, onSetActiveTerm }) {
  const queryClient = useQueryClient();
  const colorScheme = useComputedColorScheme();
  const { id, page } = useParams();
  const { data: settings } = useQuery(settingsQuery);
  const [pageProcessed, setPageProcessed] = useState(false);

  useEffect(() => {
    startHoverMode();
    applyLuteHighlights(settings.highlights.status, colorScheme);
    applyLuteHighlights(settings.highlights.general, colorScheme);
  });

  function handleSetTerm(termData) {
    // do nothing with the form
    if (!termData || termData.type === "copy") return;
    onSetActiveTerm(termData);
    // do not focus sentence when in bulk edit(shift) mode
    termData.data &&
      termData.type !== "shift" &&
      focusActiveSentence(termData.textitems);
  }

  const { mutate } = useMutation({
    mutationFn: commitPage,
    onSuccess: () => {
      queryClient.invalidateQueries(keys.books);
      setPageProcessed(true);
    },
  });

  useEffect(() => {
    mutate({ id, page });
  }, [id, mutate, page]);

  function handleSelectStart(e) {
    // trigger only with lmb
    if (e.button !== 0) return;
    handleMouseDown(e);
  }

  function handleSelectEnd(e) {
    if (e.button !== 0) return;
    const termData = handleMouseUp(e);

    if (!termData) return;
    handleSetTerm(termData);

    if (termData.type !== "copy") return;
    handleCopyText(termData);
  }

  return (
    <Box pos="relative">
      <LoadingOverlay visible={!pageProcessed} zIndex={1000} />
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

async function handleCopyText(termData) {
  const text = await copyToClipboard(termData.data);
  text &&
    notifications.show({
      title: "Selection copied to clipboard!",
      message: (
        <Text component="p" lineClamp={2} fz="xs">
          {termData.data}
        </Text>
      ),
      position: "bottom-center",
      autoClose: 2000,
      withCloseButton: false,
      withBorder: true,
      icon: <IconClipboardCheck />,
      color: "green",
    });
}

export default memo(TheText);
