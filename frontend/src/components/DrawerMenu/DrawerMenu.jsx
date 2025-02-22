import { memo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ActionIcon,
  Center,
  Divider,
  Drawer,
  Group,
  Image,
  ScrollArea,
  SegmentedControl,
  Text,
} from "@mantine/core";
import { IconPalette } from "@tabler/icons-react";
import DrawerLinks from "./components/DrawerLinks";
import SchemeToggleButton from "@common/SchemeToggleButton/SchemeToggleButton";
import MenuBookList from "./components/MenuBookList";
import DrawerFooter from "./components/DrawerFooter";
import classes from "./DrawerMenu.module.css";

function DrawerMenu({ drawerOpen, onClose, onThemeFormOpen }) {
  const [section, setSection] = useState("navigation");
  return (
    <Drawer.Root
      classNames={{ content: classes.drawer }}
      opened={drawerOpen}
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
          <Center p={10}>
            <Group gap={5}>
              <SchemeToggleButton onCloseDrawer={onClose} />
              {onThemeFormOpen && (
                <ActionIcon
                  onClick={() => {
                    onThemeFormOpen((v) => !v);
                    onClose();
                  }}
                  size="lg"
                  variant="subtle">
                  <IconPalette size="90%" />
                </ActionIcon>
              )}
            </Group>
          </Center>

          <SegmentedControl
            value={section}
            onChange={(value) => setSection(value)}
            transitionTimingFunction="ease"
            fullWidth
            data={[
              { label: "Navigation", value: "navigation" },
              { label: "Books", value: "books" },
            ]}
          />

          {section === "navigation" ? (
            <ScrollArea className={classes.scroll} type="never">
              <DrawerLinks />
            </ScrollArea>
          ) : (
            <MenuBookList onDrawerClose={onClose} />
          )}

          <Divider />

          <DrawerFooter />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}

export default memo(DrawerMenu);
