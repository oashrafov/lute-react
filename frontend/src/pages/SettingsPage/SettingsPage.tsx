import { useTranslation } from "react-i18next";
import { SettingsForm } from "../../features/settings/components/SettingsForm/SettingsForm";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";

export default function SettingsPage() {
  const { t } = useTranslation("page", { keyPrefix: "settings" });
  return (
    <PageContainer width="75%">
      <PageTitle>{t("title")}</PageTitle>
      <SettingsForm />
    </PageContainer>
  );
}
