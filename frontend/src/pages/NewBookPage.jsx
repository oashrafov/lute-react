import { useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  Drawer,
  Group,
  ScrollAreaAutosize,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import NewBookForm from "@book/components/NewBookForm/NewBookForm";
import LanguageForm from "@language/components/LanguageForm/LanguageForm";
import LanguageCards from "@language/components/LanguageCards/LanguageCards";
import PageContainer from "@common/PageContainer/PageContainer";
import PageTitle from "@common/PageTitle/PageTitle";
import { initialQuery } from "@settings/api/settings";

function NewBookPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: initial } = useQuery(initialQuery);

  const cardsRadioLabel = (
    <Group wrap="nowrap" gap={5} align="center">
      <Text component="span" fw={500} fz="sm">
        Language
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
      <Drawer.Root
        returnFocus
        transitionProps={{ duration: 150 }}
        opened={opened}
        onClose={close}
        position="bottom"
        // TODO drag and drop issue with non 100% (temporary)
        size="100%">
        <Drawer.Overlay />
        <Drawer.Content>
          <PageContainer>
            <ScrollAreaAutosize mah="100%">
              <Drawer.Header pt={32}>
                <PageTitle>Create a new language</PageTitle>
                <Drawer.CloseButton />
              </Drawer.Header>
              <Drawer.Body>
                <LanguageForm />
              </Drawer.Body>
            </ScrollAreaAutosize>
          </PageContainer>
        </Drawer.Content>
      </Drawer.Root>
      <PageContainer width="75%">
        <PageTitle>Create a new book</PageTitle>

        {initial.haveLanguages ? (
          <LanguageCards
            label={cardsRadioLabel}
            description="Choose language for your book or create new"
          />
        ) : (
          cardsRadioLabel
        )}

        <NewBookForm />
      </PageContainer>
    </>
  );
}

export default NewBookPage;
