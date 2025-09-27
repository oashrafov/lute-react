import { useRef, type MouseEvent } from "react";
import { ScrollArea } from "@mantine/core";
import { TheTextContainer } from "../TheTextContainer/TheTextContainer";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import { useActiveTermContext } from "../../../term/hooks/useActiveTermContext";
import { hasClickedOutsideText } from "../../../../helpers/interactions-desktop";
import { clearAllMarked, clearAllMultiterm } from "../../../../helpers/text";

export function PagePane() {
  const { setActiveTerm } = useActiveTermContext();
  const contextMenuAreaRef = useRef(null);

  function handleClickOutside(e: MouseEvent) {
    const res = hasClickedOutsideText(e);
    if (!res) return;
    clearAllMarked();
    clearAllMultiterm();
    setActiveTerm({ data: null });
  }

  return (
    <>
      <ContextMenu areaRef={contextMenuAreaRef} />
      <ScrollArea
        type="scroll"
        flex={1}
        onMouseDown={handleClickOutside}
        ref={contextMenuAreaRef}>
        <TheTextContainer />
      </ScrollArea>
    </>
  );
}
