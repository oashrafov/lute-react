import PageContainer from "@common/PageContainer/PageContainer";
import PageTitle from "@common/PageTitle/PageTitle";
import BackupsTable from "@backup/components/BackupsTable/BackupsTable";

function BackupsPage() {
  return (
    <PageContainer>
      <PageTitle>Backups</PageTitle>
      <BackupsTable />
    </PageContainer>
  );
}

export default BackupsPage;
