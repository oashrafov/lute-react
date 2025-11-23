import { getRouteApi } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { DictsPane } from "#language/components/DictsPane/DictsPane";
import { TermForm } from "#term/components/TermForm/TermForm";
import { query as termQuery } from "#term/api/query";
import { query as langQuery } from "#language/api/query.js";
import { TermPageLayout } from "./TermPage/TermPageLayout";

const route = getRouteApi("/terms/$termId");

export function EditTermPage() {
  const { t } = useTranslation("page", { keyPrefix: "newEditTerm" });
  const { langId } = route.useSearch();
  const { termId } = route.useParams();
  const { data: language } = useQuery(langQuery.userLanguageDetail(langId));
  const { data: term } = useQuery(termQuery.detail({ id: termId }));

  const show = !!termId && language && term;
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
      showAll={!!show}
      dictTabs={dictTabs}
      termForm={termForm}
      // textDirection={language?.right_to_left ? "rtl" : "ltr"}
      showLanguageCards={false}
      title={t("titleEdit")}
    />
  );
}
