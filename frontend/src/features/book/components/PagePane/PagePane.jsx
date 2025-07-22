import { useRef } from "react";
import { Box, ScrollArea } from "@mantine/core";
import { PageContent } from "../common/PageContent/PageContent";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import { useActiveTermContext } from "@book/hooks/useActiveTermContext";
import { hasClickedOutsideText } from "@actions/interactions-desktop";
import { removeAllMarkings } from "@actions/utils";

export function PagePane({ containerStyles }) {
  const { setActiveTerm } = useActiveTermContext();
  const contextMenuAreaRef = useRef(null);

  function handleClickOutside(e) {
    const res = hasClickedOutsideText(e);
    if (!res) return;
    removeAllMarkings();
    setActiveTerm({ data: null });
  }

  return (
    <>
      <ContextMenu areaRef={contextMenuAreaRef} />
      <Box
        onMouseDown={handleClickOutside}
        style={containerStyles}
        ref={contextMenuAreaRef}>
        <ScrollArea type="scroll" flex={1}>
          <PageContent />
        </ScrollArea>
      </Box>
    </>
  );
}
