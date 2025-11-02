import { useEffect, useState } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { getFromLocalStorage } from "../../../helpers/general";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function useApplyInitialView() {
  const navigate = route.useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const view = getFromLocalStorage("Lute.view");
    if (!view) {
      setIsSuccess(true);
      return;
    }
    navigate({ search: (prev) => ({ ...prev, view }) });

    setIsSuccess(true);
  }, [navigate]);

  return isSuccess;
}
