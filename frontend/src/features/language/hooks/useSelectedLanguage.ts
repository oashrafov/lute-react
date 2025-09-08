import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { queries } from "../api/queries";
import { useUserLanguageQuery } from "./useUserLanguageQuery";

export function useSelectedLanguage() {
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const predefinedSelected = langId === "0";
  const userSelected = langId && langId !== "0";

  const { data: predefinedLang, isSuccess: predefSuccess } = useQuery(
    queries.predefinedLanguageDetail(params.get("name"))
  );
  const { data: userLang, isSuccess: userSuccess } = useUserLanguageQuery(
    Number(langId)
  );

  const language = predefinedSelected
    ? predefinedLang
    : userSelected
      ? userLang
      : null;

  const isSuccess = predefinedSelected
    ? predefSuccess
    : userSelected
      ? userSuccess
      : false;

  return { language, isSuccess };
}
