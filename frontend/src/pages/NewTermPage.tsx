import { useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DictTabs } from "../features/language/components/DictTabs/DictTabs";
import { TermForm } from "../features/term/components/TermForm/TermForm";
import { TermPageLayout } from "./TermPage/TermPageLayout";
import { queries } from "../features/language/api/queries";

export function NewTermPage() {
  const [newTerm, setNewTerm] = useState("");
  const { langId } = useSearch({ strict: false });
  const { data: language } = useQuery(queries.userLanguageDetail(langId));

  const dictTabs = newTerm && language && (
    <DictTabs
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
