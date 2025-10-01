import { ActionIcon, rem } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { resetFocusActiveSentence } from "../../../../../../../helpers/interactions-desktop";
import { useActiveTermContext } from "../../../../../../term/hooks/useActiveTermContext";
import { useView } from "../../../../../hooks/useView";

export function EditButton() {
  const { setActiveTerm } = useActiveTermContext();
  const { setView } = useView();

  function handleClick() {
    setActiveTerm({ data: null });
    resetFocusActiveSentence();
    setView("edit");
  }

  return (
    <ActionIcon onClick={handleClick} size={24} p={0} variant="subtle">
      <IconEdit size={rem(22)} />
    </ActionIcon>
  );
}
