import { Fragment, useEffect, useRef, useState, type RefObject } from "react";
import { Affix, Divider, Menu, Text } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { clearAllFlashing, makeFlashing } from "../../../../helpers/text";
import { menu } from "./resources/menu";
import { TEXTITEM_CLASS } from "../../../../resources/constants";
import type { TextItemElement } from "../../../../resources/types";

interface ContextMenu {
  areaRef: RefObject<HTMLDivElement>;
}

interface Coords {
  clientX: number | null;
  clientY: number | null;
}

export function ContextMenu({ areaRef }: ContextMenu) {
  const [coords, setCoords] = useState<Coords>({
    clientX: null,
    clientY: null,
  });
  const selectedTextItemRef = useRef<TextItemElement | null>(null);
  const validCoords = coords.clientX !== null && coords.clientY !== null;

  const menuRef = useClickOutside(() => {
    setCoords({ clientX: null, clientY: null });
    areaRef?.current!.removeEventListener("wheel", disableScroll);
  });

  useEffect(() => {
    const ref = areaRef?.current;

    if (!ref) return;

    function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
      const { clientX, clientY } = e;
      setCoords({ clientX, clientY });
      const target = e.target as HTMLElement;
      const targetIsWord = target.matches(`.${TEXTITEM_CLASS.word}`);
      selectedTextItemRef.current = targetIsWord ? target : null;
    }

    ref.addEventListener("contextmenu", handleContextMenu);
    ref.addEventListener("wheel", disableScroll);

    return () => {
      ref.removeEventListener("contextmenu", handleContextMenu);
      ref.removeEventListener("wheel", disableScroll);
    };
  });

  type A = (typeof menu)[number]["items"][number];

  async function handleRightClick(item: A) {
    const textItemSelection = item.action(selectedTextItemRef.current);

    if (textItemSelection) {
      makeFlashing(textItemSelection);
      clearAllFlashing();
    }
  }

  function disableScroll(e: WheelEvent) {
    if (validCoords) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <Affix
      styles={{ root: { display: validCoords ? "initial" : "none" } }}
      position={
        coords.clientX !== null && coords.clientY !== null
          ? { left: coords?.clientX, top: coords?.clientY }
          : undefined
      }>
      <Menu
        shadow="md"
        width={200}
        opened={validCoords}
        keepMounted
        offset={{ mainAxis: 8, crossAxis: 100 }}>
        <div ref={menuRef}>
          <Menu.Target>
            <div />
          </Menu.Target>
          <Menu.Dropdown>
            {menu.map((section) => (
              <Fragment key={section.label}>
                <Menu.Label>
                  <Divider label={section.label} labelPosition="left" />
                </Menu.Label>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Menu.Item
                      key={item.label}
                      py={4}
                      onClick={() => handleRightClick(item)}
                      leftSection={<Icon size="1rem" />}>
                      <Text span fz="xs">
                        {item.label}
                      </Text>
                    </Menu.Item>
                  );
                })}
              </Fragment>
            ))}
          </Menu.Dropdown>
        </div>
      </Menu>
    </Affix>
  );
}
