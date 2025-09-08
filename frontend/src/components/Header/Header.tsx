import { HomeImageLink } from "../common/HomeImageLink/HomeImageLink";
import { Box, Group, Portal } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import { NavigationBar } from "../NavigationBar/NavigationBar";
import { SchemeToggleButton } from "../common/SchemeToggleButton/SchemeToggleButton";
import { BurgerButton } from "../BurgerButton/BurgerButton";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import classes from "./Header.module.css";

export function Header() {
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
          <h1 className={classes.heading}>Lute</h1>
        </Group>
        <NavigationBar visibleFrom="md" />
        <Box ml={media === "desktop" ? "unset" : "auto"}>
          <SchemeToggleButton />
        </Box>
        <BurgerButton hiddenFrom="md" />
      </Box>
    </Portal>
  );
}
