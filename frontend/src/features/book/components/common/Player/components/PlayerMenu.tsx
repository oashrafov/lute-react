import type { ReactNode } from "react";
import { Menu } from "@mantine/core";
import { PlayerRateControls } from "./PlayerRateControls";
import { PlayerBookmarkControls } from "./PlayerBookmarkControls";
import { PlayerSkipAmountSelect } from "./PlayerSkipAmountSelect";

export function PlayerMenu({ children }: { children: ReactNode }) {
  return (
    <Menu position="bottom" offset={0} shadow="md" closeOnItemClick={false}>
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>
          <PlayerRateControls />
        </Menu.Item>

        <Menu.Item>
          <PlayerBookmarkControls />
        </Menu.Item>

        <Menu.Item>
          <PlayerSkipAmountSelect />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
