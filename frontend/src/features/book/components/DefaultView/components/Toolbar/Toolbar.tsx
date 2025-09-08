import { type ReactNode } from "react";
import { ActionIcon, Menu, rem, Stack, Tooltip } from "@mantine/core";
import { useToolbar } from "../../../../hooks/useToolbar";

export function Toolbar({ children }: { children: ReactNode }) {
  const toolbarButtons = useToolbar().slice(0, -1);
  return (
    <Menu position="bottom" offset={0} shadow="md" closeOnItemClick={false}>
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown p={0}>
        <Stack gap={2} style={{ padding: rem(4) }}>
          {toolbarButtons.map((buttonGrp, index) => (
            <Menu.Item key={index}>
              <ActionIcon.Group orientation="horizontal">
                {buttonGrp.map((button) => {
                  const Icon = button.icon;
                  return (
                    <Tooltip key={button.label} label={button.label} fz="xs">
                      <ActionIcon
                        variant="subtle"
                        p={2}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          button.action();
                        }}>
                        <Icon />
                      </ActionIcon>
                    </Tooltip>
                  );
                })}
              </ActionIcon.Group>
            </Menu.Item>
          ))}
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
