import { SettingsForm } from "../../features/settings/components/SettingsForm/SettingsForm";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";

export default function SettingsPage() {
  return (
    <PageContainer width="75%">
      <PageTitle>General settings</PageTitle>
      <SettingsForm />
    </PageContainer>
  );
}
