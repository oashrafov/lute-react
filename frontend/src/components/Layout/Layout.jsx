import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { initialQuery } from "@settings/api/settings";
import { useNavigationProgress } from "@hooks/useNavigationProgress";
import { MainSideMenu } from "../MainSideMenu/MainSideMenu";
import { Header } from "../Header/Header";
import { useMediaQuery } from "@hooks/useMediaQuery";

function Layout() {
  const media = useMediaQuery();
  const { data: initial } = useQuery(initialQuery);
  useNavigationProgress();
  return (
    <>
      {initial.haveBooks && <Header />}
      {initial.haveBooks && media === "tablet" && <MainSideMenu />}
      <main style={{ marginTop: initial.haveBooks ? "6.5rem" : "3rem" }}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
