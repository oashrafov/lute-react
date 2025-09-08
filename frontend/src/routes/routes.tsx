import { lazy, Suspense, type ComponentType } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter } from "react-router-dom";
import { loader as homeLoader } from "../pages/HomePage/loader";
import { loader as bookLoader } from "../pages/BookPage/loader";
import { loader as languagesLoader } from "../pages/LanguagesPage/loader";
import { loader as termsLoader } from "../pages/TermsPage/loader";
import { loader as settingsLoader } from "../pages/SettingsPage/loader";
import { loader as shortcutsLoader } from "../pages/ShortcutsPage/loader";
import { loader as backupsLoader } from "../pages/BackupsPage/loader";
import { PageSpinner } from "../components/common/PageSpinner/PageSpinner";

export const routes = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: "/",
      element: lazyImport(() => import("../components/Layout/Layout")),
      errorElement: lazyImport(() => import("../pages/ErrorPage/ErrorPage")),
      loader: homeLoader(queryClient),
      children: [
        {
          index: true,
          element: lazyImport(() => import("../pages/HomePage/HomePage")),
        },
        {
          path: "/books/new",
          element: lazyImport(() => import("../pages/NewBookPage")),
          loader: languagesLoader(queryClient),
        },
        {
          path: "/languages",
          element: lazyImport(
            () => import("../pages/LanguagesPage/LanguagesPage")
          ),
          loader: languagesLoader(queryClient),
        },
        {
          path: "/terms",
          element: lazyImport(() => import("../pages/TermsPage/TermsPage")),
          loader: termsLoader(queryClient),
        },
        {
          path: "/terms/term",
          element: lazyImport(
            () => import("../pages/NewEditTermPage/NewEditTermPage")
          ),
          loader: termsLoader(queryClient),
        },
        {
          path: "/terms/tags",
          element: lazyImport(() => import("../pages/TagsPage")),
          loader: termsLoader(queryClient),
        },
        {
          path: "/settings/",
          element: lazyImport(
            () => import("../pages/SettingsPage/SettingsPage")
          ),
          loader: settingsLoader(queryClient),
        },
        {
          path: "/backups",
          element: lazyImport(() => import("../pages/BackupsPage/BackupsPage")),
          loader: backupsLoader(queryClient),
        },
        {
          path: "/settings/shortcuts",
          element: lazyImport(
            () => import("../pages/ShortcutsPage/ShortcutsPage")
          ),
          loader: shortcutsLoader(queryClient),
        },
        {
          path: "/stats",
          element: lazyImport(() => import("../pages/StatisticsPage")),
        },
      ],
    },
    {
      path: "/books/:id/pages/:page",
      element: lazyImport(() => import("../pages/BookPage/BookPage")),
      loader: bookLoader(queryClient),
    },
  ]);

const lazyImport = (fn: () => Promise<{ default: ComponentType }>) => {
  const Component = lazy(fn);
  return (
    <Suspense fallback={<PageSpinner />}>
      <Component />
    </Suspense>
  );
};
