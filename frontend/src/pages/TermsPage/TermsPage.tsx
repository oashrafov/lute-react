import { PageTitle } from "../../components/common/PageTitle/PageTitle";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { TermsTable } from "../../features/term/components/TermsTable/TermsTable";

export default function TermsPage() {
  return (
    <PageContainer>
      <PageTitle>Terms</PageTitle>
      <TermsTable />
    </PageContainer>
  );
}
