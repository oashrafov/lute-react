import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { ActionIcon } from "@mantine/core";
import { IconBookmarksFilled } from "@tabler/icons-react";

export const BookmarksButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function BookmarksButton(props, ref) {
  return (
    <ActionIcon
      {...props}
      ref={ref}
      size={24}
      p={0}
      variant="transparent"
      styles={{
        root: { border: "none", background: "transparent" },
      }}>
      <IconBookmarksFilled />
    </ActionIcon>
  );
});
