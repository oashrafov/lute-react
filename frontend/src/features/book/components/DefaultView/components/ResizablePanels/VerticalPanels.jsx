import { useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { paneResizeStorage } from "@actions/utils";
import classes from "./ResizablePanels.module.css";

export function VerticalPanels({ topPanel, bottomPanel }) {
  const topPanelRef = useRef();

  function onDblClickResize() {
    const panel = topPanelRef.current;
    if (panel) {
      panel.getSize() < 15 ? panel.resize(40) : panel.resize(5);
    }
  }

  return (
    <PanelGroup
      direction="vertical"
      autoSaveId="Lute.verticalSize"
      storage={paneResizeStorage}>
      <Panel order={1} defaultSize={40} ref={topPanelRef}>
        {topPanel}
      </Panel>

      <PanelResizeHandle
        hitAreaMargins={{ coarse: 10, fine: 10 }}
        className={classes.resizeHandle}
        onDoubleClick={onDblClickResize}
      />

      <Panel
        order={1}
        defaultSize={60}
        minSize={20}
        collapsible
        collapsedSize={0}>
        {bottomPanel}
      </Panel>
    </PanelGroup>
  );
}
