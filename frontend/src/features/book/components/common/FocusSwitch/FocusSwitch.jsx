import { IconFocus2 } from "@tabler/icons-react";
import { ModeSwitch } from "../ModeSwitch/ModeSwitch";
import { handleSetView } from "@actions/page";
import { useViewContext } from "@book/hooks/useViewContext";

export function FocusSwitch() {
  const { view, setView } = useViewContext();

  function handleToggleFocus() {
    setView((prev) => {
      const newView = prev === "focus" ? "default" : "focus";
      handleSetView(newView);
      return newView;
    });
  }

  return (
    <ModeSwitch
      label="Focus mode"
      icon={IconFocus2}
      checked={view === "focus"}
      onChange={handleToggleFocus}
    />
  );
}
