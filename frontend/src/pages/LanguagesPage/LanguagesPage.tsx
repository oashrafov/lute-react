import { useQuery } from "@tanstack/react-query";
import { LanguageForm } from "../../features/language/components/LanguageForm/LanguageForm";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";
import { LanguageCards } from "../../features/language/components/LanguageCards/LanguageCards";
import { LanguageRadioLabel } from "../../features/language/components/LanguageForm/components/LanguageRadioLabel";
import { queries } from "../../features/settings/api/queries";

export default function LanguagesPage() {
  const { data: initial } = useQuery(queries.init());

  return (
    <PageContainer width="75%">
      <PageTitle>Create or edit a language</PageTitle>

      {initial?.haveLanguages && (
        <LanguageCards
          label={<LanguageRadioLabel />}
          description="Edit existing language"
        />
      )}

      <LanguageForm />
    </PageContainer>
  );
}
