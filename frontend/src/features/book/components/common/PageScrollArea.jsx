import { ScrollArea } from "@mantine/core";

export function PageScrollArea({ children }) {
  return (
    <ScrollArea type="scroll" flex={1}>
      {children}
    </ScrollArea>
  );
}
