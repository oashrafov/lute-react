import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import LanguageForm from "@language/components/LanguageForm/LanguageForm";
import PageContainer from "@common/PageContainer/PageContainer";
import PageTitle from "@common/PageTitle/PageTitle";
import LanguageCards from "@language/components/LanguageCards/LanguageCards";
import LanguageRadioLabel from "@language/components/LanguageForm/components/LanguageRadioLabel";
import { initialQuery } from "@settings/api/settings";

function LanguagesPage() {
  const { data: initial } = useQuery(initialQuery);
  const [params] = useSearchParams();
  const langId = params.get("langId");

  return (
    <PageContainer width="75%">
      <PageTitle>Create or edit a language</PageTitle>

      {initial.haveLanguages && (
        <LanguageCards
          label={<LanguageRadioLabel langId={langId} />}
          description="Edit existing language"
        />
      )}

      <LanguageForm />
    </PageContainer>
  );
}

export default LanguagesPage;
