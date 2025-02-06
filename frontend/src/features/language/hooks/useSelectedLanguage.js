import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  predefinedLanguageQuery,
  userLanguageQuery,
} from "@language/api/query";

function useSelectedLanguage() {
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const predefinedSelected = langId === "0";
  const userSelected = langId && langId !== "0";

  const { data: predefinedLang, isSuccess: predefSuccess } = useQuery(
    predefinedLanguageQuery(params.get("name", null))
  );
  const { data: userLang, isSuccess: userSuccess } = useQuery(
    userLanguageQuery(langId)
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

export default useSelectedLanguage;
