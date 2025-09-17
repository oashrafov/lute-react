import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createTheme, MantineProvider, Portal } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import "./utils/i18n";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "mantine-react-table/styles.css";
import "./styles/index.css";
import "./styles/highlight.css";
import "../public/theme/theme.css";
import { GlobalContextProvider } from "./store/globalContext";
import { AppInfo } from "./components/Modals/AppInfo";
import { routes } from "./routes/routes";

const queryClient = new QueryClient();

const theme = createTheme({
  fontFamily: "Poppins, sans-serif",
  components: {
    Portal: Portal.extend({
      defaultProps: {
        reuseTargetNode: true,
      },
    }),
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <MantineProvider theme={theme}>
        <Notifications />
        <NavigationProgress />
        <ModalsProvider modals={{ about: AppInfo }}>
          <GlobalContextProvider>
            <RouterProvider router={routes(queryClient)} />
          </GlobalContextProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
