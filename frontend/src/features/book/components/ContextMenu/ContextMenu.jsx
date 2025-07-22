import { Fragment, useEffect, useRef, useState } from "react";
import { Affix, Divider, Menu, Text } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import items from "./resources/menu";
import {
  addClassToElements,
  removeAllContainingClassWithTimeout,
} from "@actions/utils";

export function ContextMenu({ areaRef }) {
  const [coords, setCoords] = useState({ clientX: null, clientY: null });
  const selectedTextItemRef = useRef();
  const validCoords = coords.clientX !== null && coords.clientY !== null;

  const menuRef = useClickOutside(() => {
    setCoords({ clientX: null, clientY: null });
    areaRef?.current.removeEventListener("wheel", disableScroll);
  });

  useEffect(() => {
    const ref = areaRef?.current;

    if (!ref) return;

    function handleContextMenu(e) {
      e.preventDefault();
      const { clientX, clientY } = e;
      setCoords({ clientX, clientY });
      selectedTextItemRef.current = e.target.matches(".word") ? e.target : null;
    }

    ref.addEventListener("contextmenu", handleContextMenu);
    ref.addEventListener("wheel", disableScroll);

    return () => {
      ref.removeEventListener("contextmenu", handleContextMenu);
      ref.removeEventListener("wheel", disableScroll);
    };
  });

  async function handleRightClick(item) {
    const textItemSelection = await item.action(selectedTextItemRef.current);

    if (textItemSelection) {
      addClassToElements(textItemSelection, "flash");
      removeAllContainingClassWithTimeout("flash");
    }
  }

  function disableScroll(e) {
    if (validCoords) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <Affix
      styles={{ display: validCoords ? "initial" : "none" }}
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
            {items.map((section) => (
              <Fragment key={section.label}>
                <Menu.Label>
                  <Divider label={section.label} labelPosition="left" />
                </Menu.Label>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Menu.Item
                      pt={4}
                      pb={4}
                      onClick={() => handleRightClick(item)}
                      key={item.label}
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
