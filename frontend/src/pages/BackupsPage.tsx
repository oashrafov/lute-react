import { PageContainer } from "../components/common/PageContainer/PageContainer";
import { PageTitle } from "../components/common/PageTitle/PageTitle";
import { BackupsTable } from "../features/settings/components/BackupsTable/BackupsTable";

export default function BackupsPage() {
  return (
    <PageContainer>
      <PageTitle>Backups</PageTitle>
      <BackupsTable />
    </PageContainer>
  );
}
