import PageTitle from "@common/PageTitle/PageTitle";
import PageContainer from "@common/PageContainer/PageContainer";
// import TermsTable from "@term/components/TermsTable/TermsTable";
import TermsGrid from "@term/components/TermsTable/TermsGrid";

function TermsPage() {
  return (
    <PageContainer>
      <PageTitle>Terms</PageTitle>
      {/* <TermsTable /> */}
      <TermsGrid />
    </PageContainer>
  );
}

export default TermsPage;
