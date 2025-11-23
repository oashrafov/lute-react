import { useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DictsPane } from "#language/components/DictsPane/DictsPane";
import { TermForm } from "#term/components/TermForm/TermForm";
import { query } from "#language/api/query.js";
import { TermPageLayout } from "./TermPage/TermPageLayout";

export function NewTermPage() {
  const [newTerm, setNewTerm] = useState("");
  const { langId } = useSearch({ strict: false });
  const { data: language } = useQuery(query.userLanguageDetail(langId));

  const dictTabs = newTerm && language && (
    <DictsPane
      key={`${newTerm}${langId}`}
      dictionaries={language.dictionaries.filter(
        (dict) => dict.for === "terms"
      )}
      termText={newTerm}
    />
  );

  return (
    <TermPageLayout
      showAll={!!language}
      dictTabs={dictTabs}
      termForm={<TermForm onSetTermText={setNewTerm} />}
    />
  );
}
