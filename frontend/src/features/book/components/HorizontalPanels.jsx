import { useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { paneResizeStorage } from "@actions/utils";
import classes from "./Book/Book.module.css";

function HorizontalPanels({ leftPanel, rightPanel }) {
  const rightPanelRef = useRef(null);

  function onDblClickResize() {
    const panel = rightPanelRef.current;
    if (panel) {
      panel.getSize() < 15 ? panel.resize(50) : panel.resize(5);
    }
  }

  return (
    <PanelGroup
      style={{ height: "100vh" }}
      className="readpage"
      autoSaveId="Lute.horizontalSize"
      direction="horizontal"
      storage={paneResizeStorage}>
      <Panel
        order={1}
        defaultSize={50}
        minSize={30}
        className={`${classes.paneLeft} paneLeft`}>
        {leftPanel}
      </Panel>

      {/* {showRightPanel && ( */}
      <>
        <PanelResizeHandle
          hitAreaMargins={{ coarse: 10, fine: 10 }}
          className={classes.resizeHandle}
          onDoubleClick={onDblClickResize}
        />

        <Panel
          ref={rightPanelRef}
          defaultSize={50}
          order={2}
          collapsible={true}
          minSize={5}>
          {rightPanel}
        </Panel>
      </>
      {/* // )} */}
    </PanelGroup>
  );
}

export default HorizontalPanels;
