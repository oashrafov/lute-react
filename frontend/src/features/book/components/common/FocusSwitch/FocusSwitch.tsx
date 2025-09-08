import { useTransition } from "react";
import { IconFocus2 } from "@tabler/icons-react";
import { ModeSwitch } from "../ModeSwitch/ModeSwitch";
import { handleSetView } from "../../../../../helpers/page";
import { useViewContext } from "../../../hooks/useViewContext";

export function FocusSwitch() {
  const { view, setView } = useViewContext();
  const [, startTransition] = useTransition();

  function handleToggleFocus() {
    startTransition(() =>
      setView((prev) => {
        const newView = prev === "focus" ? "default" : "focus";
        handleSetView(newView);
        return newView;
      })
    );
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
