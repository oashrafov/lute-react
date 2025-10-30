import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { LanguageForm } from "../../features/language/components/LanguageForm/LanguageForm";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";
import { LanguageCards } from "../../features/language/components/LanguageCards/LanguageCards";
import { LanguageRadioLabel } from "./LanguageRadioLabel";
import { queries } from "../../features/settings/api/queries";

export function LanguagesPage() {
  const { t } = useTranslation("page", { keyPrefix: "languages" });
  const { data } = useSuspenseQuery(queries.init());
  return (
    <PageContainer width="75%">
      <PageTitle>{t("title")}</PageTitle>

      {data.haveLanguages && (
        <LanguageCards
          label={<LanguageRadioLabel />}
          description={t("languageCardsDescription")}
        />
      )}

      <LanguageForm />
    </PageContainer>
  );
}
