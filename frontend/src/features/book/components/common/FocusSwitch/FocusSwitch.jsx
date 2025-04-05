import { IconFocus2 } from "@tabler/icons-react";
import ModeSwitch from "../ModeSwitch/ModeSwitch";
import { handleSetFocusMode } from "@actions/page";

function FocusSwitch({ checked, dispatch }) {
  return (
    <ModeSwitch
      label="Focus mode"
      icon={IconFocus2}
      checked={checked}
      onChange={(e) =>
        handleSetFocusMode(Boolean(e.currentTarget.checked), dispatch)
      }
    />
  );
}

export default FocusSwitch;
