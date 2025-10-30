import { getRouteApi } from "@tanstack/react-router";
import type { View } from "../../../resources/types";
import { setLocalStorageItem } from "../../../helpers/general";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function useView() {
  const navigate = route.useNavigate();
  const { view } = route.useSearch();

  function setView(view: View) {
    setLocalStorageItem("Lute.view", view);
    navigate({ search: { view } });
  }

  function toggleFocus() {
    setView(view === "focus" ? "default" : "focus");
  }

  return {
    get view() {
      return (view ?? "default") as View;
    },
    toggleFocus,
    setView,
  };
}
