import { ActionIcon } from "@mantine/core";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

export const PageActionButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button"> & { icon: ReactNode }
>(function PageActionButton(props, ref) {
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
});
