import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ActionIcon, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import { NewBookForm } from "../../features/book/components/NewBookForm/NewBookForm";
import { LanguageCards } from "../../features/language/components/LanguageCards/LanguageCards";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { PageTitle } from "../../components/common/PageTitle/PageTitle";
import { queries } from "../../features/settings/api/queries";
import { CreateLanguageModal } from "./CreateLanguageModal";

export function NewBookPage() {
  const { t } = useTranslation("page", { keyPrefix: "newBook" });
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = useSuspenseQuery(queries.init());

  const cardsRadioLabel = (
    <Group wrap="nowrap" gap={5} align="center">
      <Text component="span" fw={500} fz="sm">
        {t("languageCardsLabel")}
      </Text>
      <ActionIcon
        variant="transparent"
        color="green.6"
        onClick={open}
        size="sm">
        <IconSquareRoundedPlusFilled />
      </ActionIcon>
    </Group>
  );

  return (
    <>
      <CreateLanguageModal isOpen={opened} onClose={close} />
      <PageContainer w="75%">
        <PageTitle>{t("title")}</PageTitle>

        {data.haveLanguages && (
          <LanguageCards
            label={cardsRadioLabel}
            description={t("languageCardsDescription")}
          />
        )}
        {!data.haveLanguages && cardsRadioLabel}

        <NewBookForm />
      </PageContainer>
    </>
  );
}
