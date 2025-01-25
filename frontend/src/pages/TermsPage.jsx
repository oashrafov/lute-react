import { useQuery } from "@tanstack/react-query";
import PageTitle from "@common/PageTitle/PageTitle";
import PageContainer from "@common/PageContainer/PageContainer";
import TermsTable from "@term/components/TermsTable/TermsTable";
import { initialQuery } from "@settings/api/settings";
import { getTagSuggestionsQuery } from "@term/api/query";

function TermsPage() {
  const { data: initial } = useQuery(initialQuery);
  const { data: tagChoices } = useQuery(getTagSuggestionsQuery);
  return (
    <PageContainer>
      <PageTitle>Terms</PageTitle>
      <TermsTable
        languageChoices={initial.languageChoices}
        tagChoices={tagChoices}
      />
    </PageContainer>
  );
}

export default TermsPage;
