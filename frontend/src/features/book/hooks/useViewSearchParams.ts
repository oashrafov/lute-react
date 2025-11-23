import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { TextDirection } from "#resources/types.ts";

export function useViewSearchParams(langId: number, textDir: TextDirection) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({
      to: ".",
      search: (s) => ({ ...s, langId, textDir }),
    });
  }, [langId, textDir, navigate]);
}
