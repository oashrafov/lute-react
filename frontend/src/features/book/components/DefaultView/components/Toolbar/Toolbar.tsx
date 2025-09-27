import { type ReactNode } from "react";
import { Group, Menu, rem, Stack, Tooltip } from "@mantine/core";
import { toolbar } from "../../../../../../resources/toolbar";

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <Menu position="bottom" offset={0} shadow="md" closeOnItemClick={false}>
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown p={0}>
        <Stack gap={2} style={{ padding: rem(4) }}>
          {toolbar.slice(0, -1).map((buttonGrp, index) => (
            <Group key={index} wrap="nowrap" gap={0}>
              {buttonGrp.map((button) => {
                const Icon = button.icon;
                return (
                  <Tooltip key={button.label} label={button.label} fz="xs">
                    <Menu.Item
                      p={5}
                      color="blue.6"
                      variant="subtle"
                      styles={{ itemSection: { margin: 0 } }}
                      leftSection={<Icon size={18} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        button.action();
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Group>
          ))}
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
