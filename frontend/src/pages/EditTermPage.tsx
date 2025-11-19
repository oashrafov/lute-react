import { getRouteApi, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { DictsPane } from "#language/components/DictsPane/DictsPane";
import { TermForm } from "#term/components/TermForm/TermForm";
import { queries as termQueries } from "#term/api/queries";
import { queries as langQueries } from "#language/api/queries";
import { TermPageLayout } from "./TermPage/TermPageLayout";

const route = getRouteApi("/terms/$termId");

export function EditTermPage() {
  const { t } = useTranslation("page", { keyPrefix: "newEditTerm" });
  const { langId } = useSearch({ strict: false });
  const { termId } = route.useParams();
  const { data: language } = useQuery(langQueries.userLanguageDetail(langId));
  const { data: term } = useQuery(termQueries.detail({ id: termId }));

  const show = !!termId && language && term;
  const dictTabs = show && language && (
    <DictsPane key={term.text} language={language} termText={term.text} />
  );
  const termForm = show && (
    <TermForm term={term} language={language} onAction={() => {}} />
  );

  return (
    <TermPageLayout
      showAll={!!show}
      dictTabs={dictTabs}
      termForm={termForm}
      textDirection={language?.right_to_left ? "rtl" : "ltr"}
      showLanguageCards={false}
      title={t("titleEdit")}
    />
  );
}
