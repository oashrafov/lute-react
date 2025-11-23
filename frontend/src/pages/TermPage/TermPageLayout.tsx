import type { ReactNode } from "react";
import { useSearch } from "@tanstack/react-router";
import { Group, Box } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { PageContainer } from "#common/PageContainer/PageContainer";
import { PageTitle } from "#common/PageTitle/PageTitle";
import { LanguageCards } from "#language/components/LanguageCards/LanguageCards";
import { Placeholder } from "./Placeholder";

interface TermPageLayout {
  showAll: boolean;
  termForm: ReactNode;
  dictTabs: ReactNode;
  showLanguageCards?: boolean;
  title?: string;
}

export function TermPageLayout({
  showAll,
  termForm,
  dictTabs,
  title,
  showLanguageCards = true,
}: TermPageLayout) {
  const { textDir } = useSearch({ strict: false });
  const { t } = useTranslation("page", { keyPrefix: "newEditTerm" });
  const pageTitle = title || t("titleCreate");
  return (
    <PageContainer w="90%">
      <PageTitle>{pageTitle}</PageTitle>
      {showLanguageCards && (
        <LanguageCards
          label={t("languageCardsLabel")}
          description={t("languageCardsDescription")}
        />
      )}
      {showAll ? (
        <Group justify="center" align="flex-start" dir={textDir}>
          <Box flex={0.3}>{termForm}</Box>
          <Box flex={0.7} h={600}>
            {dictTabs ?? <Placeholder label={t("dictTabsPlaceholderLabel")} />}
          </Box>
        </Group>
      ) : (
        <Placeholder label={t("termFormPlaceholderLabel")} />
      )}
      ;
    </PageContainer>
  );
}
