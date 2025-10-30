import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { queries } from "../api/queries";

export function useSelectedLanguage() {
  const { langId, langName } = useSearch({ strict: false });
  const { data: predefinedLang, isSuccess: predefSuccess } = useQuery(
    queries.predefinedLanguageDetail(langName)
  );
  const { data: userLang, isSuccess: userSuccess } = useQuery(
    queries.userLanguageDetail(langId)
  );

  const language = predefinedLang || userLang;
  const isSuccess = predefSuccess || userSuccess;

  return { language, isSuccess };
}
