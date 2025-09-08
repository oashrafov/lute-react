import { Chip } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import type { MRT_VisibilityState } from "mantine-react-table";

interface ShowParentsOnlyChip {
  show: boolean;
  onShow: Dispatch<SetStateAction<boolean>>;
  onSetColumnVisibility: Dispatch<SetStateAction<MRT_VisibilityState>>;
}

export function ShowParentsOnlyChip({
  show,
  onShow,
  onSetColumnVisibility,
}: ShowParentsOnlyChip) {
  function handleShowParentsOnly() {
    onSetColumnVisibility((v) => ({
      ...v,
      parentsString: !v.parentsString,
    }));
    onShow((v) => !v);
  }

  return (
    <Chip
      checked={show}
      onChange={handleShowParentsOnly}
      size="xs"
      style={{ alignSelf: "center" }}>
      Show parents only
    </Chip>
  );
}
