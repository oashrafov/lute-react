import { Link } from "react-router-dom";
import { Divider, Drawer, Group, Image, Text } from "@mantine/core";
import classes from "./DrawerMenu.module.css";

export function DrawerMenu({ isOpen, onClose, children }) {
  return (
    <Drawer.Root
      classNames={{ content: classes.drawer }}
      opened={isOpen}
      onClose={onClose}
      size="250">
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Header>
          <Group justify="space-between" align="center">
            <Link to="/">
              <Image w="auto" h={32} src="/images/logo.png" />
            </Link>
            <Text>Lute 3</Text>
          </Group>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Divider />

        <Drawer.Body p={0} className={classes.drawer}>
          {children}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
