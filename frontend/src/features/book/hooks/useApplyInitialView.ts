import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFromLocalStorage } from "../../../helpers/general";

export function useApplyInitialView() {
  const [searchParam, setSearchParam] = useSearchParams();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const view = getFromLocalStorage("Lute.view");
    if (!view) {
      setReady(true);
      return;
    }

    if (view === "default") {
      searchParam.delete("view");
    } else {
      searchParam.set("view", view);
    }

    setSearchParam(searchParam);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
}
