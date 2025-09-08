import { PageTitle } from "../components/common/PageTitle/PageTitle";
import { PageContainer } from "../components/common/PageContainer/PageContainer";
import { TagsTable } from "../features/term/components/TagsTable/TagsTable";

export default function TagsPage() {
  return (
    <PageContainer>
      <PageTitle>Tags</PageTitle>
      <TagsTable />
    </PageContainer>
  );
}
