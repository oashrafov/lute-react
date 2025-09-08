import { ScrollArea, type ScrollAreaProps } from "@mantine/core";

interface PageScrollArea {
  children: ScrollAreaProps["children"];
}

export function PageScrollArea({ children }: PageScrollArea) {
  return (
    <ScrollArea type="scroll" flex={1}>
      {children}
    </ScrollArea>
  );
}
