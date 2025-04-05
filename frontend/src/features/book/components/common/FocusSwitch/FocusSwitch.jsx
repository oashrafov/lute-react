import { useContext } from "react";
import { IconFocus2 } from "@tabler/icons-react";
import ModeSwitch from "../ModeSwitch/ModeSwitch";
import { BookContext } from "@book/store/bookContext";
import { handleSetFocusMode } from "@actions/page";

function FocusSwitch() {
  const { state, dispatch } = useContext(BookContext);
  return (
    <ModeSwitch
      label="Focus mode"
      icon={IconFocus2}
      checked={state.focusMode}
      onChange={(e) =>
        handleSetFocusMode(Boolean(e.currentTarget.checked), dispatch)
      }
    />
  );
}

export default FocusSwitch;
