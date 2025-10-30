import type { ReactNode } from "react";
import { Group, Box } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";
import { LanguageCards } from "../../features/language/components/LanguageCards/LanguageCards";
import { Placeholder } from "./Placeholder";
import type { TextDirection } from "../../resources/types";

interface TermPageLayout {
  textDirection: TextDirection;
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
  textDirection,
  title,
  showLanguageCards = true,
}: TermPageLayout) {
  const { t } = useTranslation("page", { keyPrefix: "newEditTerm" });
  const pageTitle = title || t("titleCreate");
  return (
    <PageContainer width="90%">
      <PageTitle>{pageTitle}</PageTitle>
      {showLanguageCards && (
        <LanguageCards
          label={t("languageCardsLabel")}
          description={t("languageCardsDescription")}
        />
      )}
      {showAll ? (
        <Group justify="center" align="flex-start" dir={textDirection}>
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
