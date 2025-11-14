import { PageContainer } from "../components/common/PageContainer/PageContainer";
import { PageTitle } from "../components/common/PageTitle/PageTitle";
import { ShortcutsForm } from "../features/settings/components/ShortcutsForm/ShortcutsForm";

export default function ShortcutsPage() {
  return (
    <PageContainer w="75%">
      <PageTitle>Keyboard shortcuts</PageTitle>
      <ShortcutsForm />
    </PageContainer>
  );
}
