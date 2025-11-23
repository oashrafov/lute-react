import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { query } from "../api/query";

export function useSelectedLanguage() {
  const { langId, langName } = useSearch({ strict: false });
  const { data: predefinedLang, isSuccess: predefSuccess } = useQuery(
    query.predefinedLanguageDetail(langName)
  );
  const { data: userLang, isSuccess: userSuccess } = useQuery(
    query.userLanguageDetail(langId)
  );

  const language = predefinedLang || userLang;
  const isSuccess = predefSuccess || userSuccess;

  return { language, isSuccess };
}
