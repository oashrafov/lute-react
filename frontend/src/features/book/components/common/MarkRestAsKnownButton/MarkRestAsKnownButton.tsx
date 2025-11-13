import { Tooltip } from "@mantine/core";
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";
import { PageActionButton } from "../../DefaultView/components/DefaultHeader/components/PageActionButton";
import { useMarkPageAsRead } from "../../../hooks/useMarkPageAsRead";

export function MarkRestAsKnownButton() {
  const markPageAsRead = useMarkPageAsRead();

  function handleClick() {
    markPageAsRead(true);
  }

  return (
    <Tooltip label="Mark rest as known" position="right">
      <PageActionButton
        onClick={handleClick}
        icon={IconRosetteDiscountCheckFilled}
        color="green.6"
      />
    </Tooltip>
  );
}
