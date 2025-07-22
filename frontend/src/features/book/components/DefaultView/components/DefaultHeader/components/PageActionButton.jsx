import { ActionIcon } from "@mantine/core";
import { forwardRef } from "react";

export const PageActionButton = forwardRef(
  function PageActionButton(props, ref) {
    const { onClick, icon, color, disabled = false } = props;
    return (
      <ActionIcon
        ref={ref}
        onClick={onClick}
        color={color}
        disabled={disabled}
        size={24}
        variant="transparent"
        styles={{
          root: { border: "none", backgroundColor: "transparent" },
        }}>
        {icon}
      </ActionIcon>
    );
  }
);
