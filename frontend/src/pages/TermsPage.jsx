import PageTitle from "@common/PageTitle/PageTitle";
import PageContainer from "@common/PageContainer/PageContainer";
import TermsTable from "@term/components/TermsTable/TermsTable";

function TermsPage() {
  return (
    <PageContainer>
      <PageTitle>Terms</PageTitle>
      <TermsTable />
    </PageContainer>
  );
}

export default TermsPage;
