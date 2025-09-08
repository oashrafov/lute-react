import { ActionIcon, Tooltip } from "@mantine/core";
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";

export function MarkRestAsKnownButton() {
  return (
    <Tooltip label="Mark rest as known" position="right">
      <ActionIcon
        color="green.6"
        size={24}
        variant="transparent"
        styles={{
          root: { border: "none", backgroundColor: "transparent" },
        }}>
        <IconRosetteDiscountCheckFilled />
      </ActionIcon>
    </Tooltip>
  );
}
