import { Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigationProgress } from "#hooks/useNavigationProgress";
import { useMediaQuery } from "#hooks/useMediaQuery";
import { queries } from "#settings/api/queries";
import { MainSideMenu } from "../MainSideMenu/MainSideMenu";
import { AppHeader } from "../AppHeader/AppHeader";

export function Layout() {
  const media = useMediaQuery();
  const { data: initial } = useSuspenseQuery(queries.init());
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
