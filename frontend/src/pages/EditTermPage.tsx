import { getRouteApi } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { DictsPane } from "#language/components/DictsPane/DictsPane";
import { TermForm } from "#term/components/TermForm/TermForm";
import { query as termQuery } from "#term/api/query";
import { TermPageLayout } from "./TermPage/TermPageLayout";
import { useUserLanguageQuery } from "#language/hooks/useUserLanguageQuery";

const route = getRouteApi("/terms/$termId");

export function EditTermPage() {
  const { t } = useTranslation("page", { keyPrefix: "newEditTerm" });
  const { termId: id } = route.useParams();
  const { data: language } = useUserLanguageQuery();
  const { data: term } = useQuery(termQuery.detail({ id }));

  const show = !!id && language && term;
  const dictTabs = show && language && (
    <DictsPane
      key={term.text}
      dictionaries={language.dictionaries.filter(
        (dict) => dict.for === "terms"
      )}
      termText={term.text}
    />
  );
  const termForm = show && <TermForm term={term} />;

  return (
    <TermPageLayout
      title={t("titleEdit")}
      showAll={!!show}
      dictTabs={dictTabs}
      termForm={termForm}
      showLanguageCards={false}
    />
  );
}
