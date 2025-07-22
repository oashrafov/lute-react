import { Menu, Select } from "@mantine/core";
import { PlayerRateControls } from "./PlayerRateControls";
import { PlayerBookmarkControls } from "./PlayerBookmarkControls";
import { usePlayerContext } from "../hooks/usePlayerContext";

export function PlayerMenu({ children }) {
  const { state, dispatch, audio } = usePlayerContext();
  return (
    <Menu position="bottom" offset={0} shadow="md" closeOnItemClick={false}>
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>
          <PlayerRateControls />
        </Menu.Item>

        <Menu.Item>
          <PlayerBookmarkControls
            audio={audio}
            state={state}
            dispatch={dispatch}
          />
        </Menu.Item>

        <Menu.Item>
          <Select
            label="Skip amount"
            onChange={(_value, option) =>
              dispatch({ type: "skipAmount", payload: option.value })
            }
            allowDeselect={false}
            styles={{ root: { width: "5.5rem" } }}
            checkIconPosition="right"
            size="xs"
            value={state.skipAmount}
            data={[
              { value: "3", label: "3 sec" },
              { value: "5", label: "5 sec" },
              { value: "10", label: "10 sec" },
              { value: "30", label: "30 sec" },
              { value: "60", label: "60 sec" },
            ]}
          />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
