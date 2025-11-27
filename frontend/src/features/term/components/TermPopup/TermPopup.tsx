import { useState, type ReactNode } from "react";
import { Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { PopupData } from "./components/PopupData/PopupData";
import { query } from "#term/api/query";
import type { TermPopup } from "#term/api/types";

interface TermPopupProps {
  id: number | null;
  children: ReactNode;
}

export function TermPopup({ children, id }: TermPopupProps) {
  const queryClient = useQueryClient();
  const [opened, { close, open }] = useDisclosure(false);
  const [popupData, setPopupData] = useState<TermPopup>();

  async function fetchPopupData() {
    if (id !== null) {
      setPopupData(await queryClient.fetchQuery(query.popup(id)));
    }
  }

  return (
    <Popover
      position="bottom"
      middlewares={{ flip: { fallbackPlacements: ["top", "right", "left"] } }}
      transitionProps={{
        duration: 150,
        transition: "fade-up",
        enterDelay: 50,
        exitDelay: 0,
      }}
      floatingStrategy="fixed"
      withArrow
      shadow="md"
      opened={opened}
      onOpen={fetchPopupData}>
      <Popover.Target>
        <span onMouseEnter={open} onMouseLeave={close} onContextMenu={close}>
          {children}
        </span>
      </Popover.Target>
      <Popover.Dropdown hidden={!popupData} style={{ pointerEvents: "none" }}>
        {popupData && <PopupData data={popupData} />}
      </Popover.Dropdown>
    </Popover>
  );
}
