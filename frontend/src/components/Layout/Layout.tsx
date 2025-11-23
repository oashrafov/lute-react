import { Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigationProgress } from "#hooks/useNavigationProgress";
import { useMediaQuery } from "#hooks/useMediaQuery";
import { query } from "#settings/api/query";
import { MainSideMenu } from "../MainSideMenu/MainSideMenu";
import { AppHeader } from "../AppHeader/AppHeader";

export function Layout() {
  const media = useMediaQuery();
  const { data: initial } = useSuspenseQuery(query.init());
  useNavigationProgress();
  return (
    <>
      {initial.haveBooks && <AppHeader />}
      {initial.haveBooks && media === "tablet" && <MainSideMenu />}
      <main style={{ marginTop: initial.haveBooks ? "6.5rem" : "3rem" }}>
        <Outlet />
      </main>
    </>
  );
}
