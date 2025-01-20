import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { Box, Portal } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import MainMenuBar from "../MainMenuBar/MainMenuBar";
import { settingsQuery } from "@settings/api/settings";
import useNavigationProgress from "@hooks/useNavigationProgress";
import classes from "../MainMenuBar/MainMenuBar.module.css";

function Layout() {
  const { data: settings } = useQuery(settingsQuery);
  const pinned = useHeadroom({ fixedAt: 120 });

  useNavigationProgress();

  return (
    <>
      <Portal>
        <Box
          className={classes.headerContainer}
          style={{
            transform: `translate3d(0, ${pinned ? 0 : "-110px"}, 0)`,
          }}>
          <MainMenuBar settings={settings} />
        </Box>
      </Portal>
      <main style={{ marginTop: "6.5rem" }}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
