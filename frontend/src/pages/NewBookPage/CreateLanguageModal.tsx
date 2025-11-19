import { Drawer, ScrollAreaAutosize } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { PageContainer } from "#common/PageContainer/PageContainer";
import { PageTitle } from "#common/PageTitle/PageTitle";
import { LanguageForm } from "#language/components/LanguageForm/LanguageForm";

interface CreateLanguageModal {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateLanguageModal({ isOpen, onClose }: CreateLanguageModal) {
  const { t } = useTranslation("page", { keyPrefix: "newBook" });
  return (
    <Drawer.Root
      returnFocus
      transitionProps={{ duration: 150 }}
      opened={isOpen}
      onClose={onClose}
      position="bottom"
      size="75%">
      <Drawer.Overlay />
      <Drawer.Content>
        <PageContainer>
          <ScrollAreaAutosize mah="100%">
            <Drawer.Header pt={32}>
              <PageTitle>{t("createLanguageModalTitle")}</PageTitle>
              <Drawer.CloseButton />
            </Drawer.Header>
            <Drawer.Body>
              <LanguageForm />
            </Drawer.Body>
          </ScrollAreaAutosize>
        </PageContainer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
