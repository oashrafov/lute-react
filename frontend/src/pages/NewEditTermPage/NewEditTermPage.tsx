import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Box, Group } from "@mantine/core";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";
import { LanguageCards } from "../../features/language/components/LanguageCards/LanguageCards";
import { DictTabs } from "../../features/language/components/DictTabs/DictTabs";
import { TermForm } from "../../features/term/components/TermForm/TermForm";
import { Placeholder } from "./Placeholder";
import { queries as termQueries } from "../../features/term/api/queries";
import { useUserLanguageQuery } from "../../features/language/hooks/useUserLanguageQuery";

export default function NewEditTermPage() {
  const { t } = useTranslation("page", { keyPrefix: "newEditTerm" });
  const [newTerm, setNewTerm] = useState("");
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const termId = params.get("termId");
  const { data: language } = useUserLanguageQuery(Number(langId));
  const { data: term } = useQuery(termQueries.detail({ id: Number(termId) }));

  const editMode = termId && language && term;

  return (
    <PageContainer width="90%">
      <PageTitle>{t(termId ? "titleEdit" : "titleCreate")}</PageTitle>
      {!termId && (
        <LanguageCards
          label={t("languageCardsLabel")}
          description={t("languageCardsDescription")}
        />
      )}

      {language || editMode ? (
        <Group
          justify="center"
          align="flex-start"
          dir={language.right_to_left ? "rtl" : "ltr"}>
          <Box flex={0.3}>
            <TermForm
              key={term.text}
              term={termId ? term : undefined}
              language={language}
              onSetTerm={setNewTerm}
            />
          </Box>
          <Box flex={0.7} h={600}>
            {newTerm || editMode ? (
              <DictTabs
                key={termId ? term.text : newTerm}
                language={language}
                termText={termId ? term.text : newTerm}
              />
            ) : (
              <Placeholder label={t("dictTabsPlaceholderLabel")} />
            )}
          </Box>
        </Group>
      ) : (
        !termId && <Placeholder label={t("termFormPlaceholderLabel")} />
      )}
    </PageContainer>
  );
}
