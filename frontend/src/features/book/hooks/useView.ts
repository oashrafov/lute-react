import { useSearchParams } from "react-router-dom";
import type { View } from "../../../resources/types";
import { setLocalStorageItem } from "../../../helpers/general";

export function useView() {
  const [searchParam, setSearchParam] = useSearchParams();

  function setView(view: View) {
    if (view === "default") {
      searchParam.delete("view");
    } else {
      searchParam.set("view", view);
    }
    setLocalStorageItem("Lute.view", view);
    setSearchParam(searchParam);
  }

  function toggleFocus() {
    setView(searchParam.get("view") === "focus" ? "default" : "focus");
  }

  return {
    get view() {
      return (searchParam.get("view") ?? "default") as View;
    },
    toggleFocus,
    setView,
  };
}
