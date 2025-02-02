import { Divider, Menu, Select, Stack, Text } from "@mantine/core";
import PlayerRateControls from "./PlayerRateControls";
import PlayerBookmarkControls from "./PlayerBookmarkControls";

function PlayerMenu({ children, audio, state, dispatch }) {
  return (
    <Menu position="bottom" offset={0} shadow="md">
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown p={10}>
        <Stack gap={5} align="center">
          <Text fz="xs">Playback rate</Text>
          <PlayerRateControls audio={audio} state={state} dispatch={dispatch} />

          <Divider w="100%" />

          <Text fz="xs">Bookmarks</Text>
          <PlayerBookmarkControls
            audio={audio}
            state={state}
            dispatch={dispatch}
          />

          <Divider w="100%" />

          <Text fz="xs">Skip amount</Text>
          <Select
            onChange={(_value, option) =>
              dispatch({ type: "skipAmount", payload: option.value })
            }
            allowDeselect={false}
            styles={{ root: { width: "5rem" } }}
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
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}

export default PlayerMenu;
