import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Box, Group, Paper, Text } from "@mantine/core";
import PageContainer from "@common/PageContainer/PageContainer";
import PageTitle from "@common/PageTitle/PageTitle";
import LanguageCards from "@language/components/LanguageCards/LanguageCards";
import DictTabs from "@language/components/DictTabs/DictTabs";
import TermForm from "@term/components/TermForm/TermForm";
import { definedLangInfoQuery } from "@language/api/language";
import { getTermQuery } from "@term/api/query";

function NewEditTermPage() {
  const [newTerm, setNewTerm] = useState("");
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const termId = params.get("termId");
  const { data: language } = useQuery(definedLangInfoQuery(langId));
  const { data: term } = useQuery(getTermQuery(termId));

  const editMode = termId && language && term;

  return (
    <PageContainer width="90%">
      <PageTitle>{termId ? "Edit term" : "Create new term"}</PageTitle>
      {!termId && (
        <LanguageCards
          label="My languages"
          description="Pick a language to add the new term"
        />
      )}

      {language || editMode ? (
        <Group
          justify="center"
          align="flex-start"
          dir={language.isRightToLeft ? "rtl" : "ltr"}>
          <Box flex={0.3}>
            <TermForm
              key={term}
              term={termId ? term : undefined}
              language={language}
              onSetTerm={setNewTerm}
            />
          </Box>
          <Box flex={0.7} h={600}>
            {newTerm || editMode ? (
              <DictTabs
                key={termId ? term.text : newTerm}
                language={language}
                termText={termId ? term.text : newTerm}
              />
            ) : (
              <Placeholder label="Type term text and click the lookup button to load dictionaries" />
            )}
          </Box>
        </Group>
      ) : (
        !termId && (
          <Placeholder label="Select a language to show the term form" />
        )
      )}
    </PageContainer>
  );
}

function Placeholder({ label }) {
  return (
    <Paper
      flex={0.3}
      h={600}
      shadow="xs"
      withBorder
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Text c="dimmed" size="sm">
        {label}
      </Text>
    </Paper>
  );
}

export default NewEditTermPage;
