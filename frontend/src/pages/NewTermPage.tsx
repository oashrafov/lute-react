import { useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DictsPane } from "#language/components/DictsPane/DictsPane";
import { TermForm } from "#term/components/TermForm/TermForm";
import { queries } from "#language/api/queries";
import { TermPageLayout } from "./TermPage/TermPageLayout";

export function NewTermPage() {
  const [newTerm, setNewTerm] = useState("");
  const { langId } = useSearch({ strict: false });
  const { data: language } = useQuery(queries.userLanguageDetail(langId));

  const dictTabs = newTerm && language && (
    <DictsPane
      key={`${newTerm}${langId}`}
      language={language}
      termText={newTerm}
    />
  );

  return (
    <TermPageLayout
      showAll={!!language}
      dictTabs={dictTabs}
      termForm={
        <TermForm
          language={language}
          onSetTerm={setNewTerm}
          onAction={() => {}}
        />
      }
      textDirection={language?.right_to_left ? "rtl" : "ltr"}
    />
  );
}
