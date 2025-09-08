import { Select } from "@mantine/core";
import { usePlayerContext } from "../hooks/usePlayerContext";

export function PlayerSkipAmountSelect() {
  const { state, dispatch } = usePlayerContext();
  return (
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
  );
}
