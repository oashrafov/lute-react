import { HomeImageLink } from "../common/HomeImageLink/HomeImageLink";
import { Box, Group, Portal } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import { NavigationBar } from "../NavigationBar/NavigationBar";
import { BurgerButton } from "../BurgerButton/BurgerButton";
import { ThemeSelect } from "../common/ThemeSelect/ThemeSelect";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import classes from "./AppHeader.module.css";

export function AppHeader() {
  const media = useMediaQuery();
  const pinned = useHeadroom({ fixedAt: 120 });
  return (
    <Portal>
      <Box
        component="header"
        className={classes.header}
        style={{
          transform: `translate3d(0, ${pinned ? 0 : "-110px"}, 0)`,
        }}>
        <Group wrap="nowrap">
          <HomeImageLink size={54} />
          <h1>Lute</h1>
        </Group>
        <NavigationBar visibleFrom="md" />
        <Box ml={media === "desktop" ? "unset" : "auto"}>
          <ThemeSelect />
        </Box>
        <BurgerButton hiddenFrom="md" />
      </Box>
    </Portal>
  );
}
