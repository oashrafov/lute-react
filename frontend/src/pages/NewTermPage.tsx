import { useState } from "react";
import { DictsPane } from "#language/components/DictsPane/DictsPane";
import { TermForm } from "#term/components/TermForm/TermForm";
import { TermPageLayout } from "./TermPage/TermPageLayout";
import { useUserLanguageQuery } from "#language/hooks/useUserLanguageQuery";

export function NewTermPage() {
  const [newTerm, setNewTerm] = useState("");
  const { data: language } = useUserLanguageQuery();

  const dictTabs = newTerm && language && (
    <DictsPane
      key={`${newTerm}${language.id}`}
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
