import type { RefObject } from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Box, Tabs } from "@mantine/core";
import { TermForm } from "#term/components/TermForm/TermForm";
import { useActiveTermContext } from "#term/hooks/useActiveTermContext";
import type { TermDetail } from "#term/api/types";
import { query } from "#term/api/query";
import { TermVariationsList } from "#term/components/TermSentences/TermVariationsList/TermVariationsList";
import { PageSpinner } from "#common/PageSpinner/PageSpinner";

interface TermInfoPane {
  term: TermDetail;
  translationFieldRef: RefObject<HTMLTextAreaElement>;
  showPronunciationField?: boolean;
}

export function TermInfoPane({
  term,
  translationFieldRef,
  showPronunciationField,
}: TermInfoPane) {
  const { langId } = useSearch({ strict: false });
  const { data } = useQuery(query.sentences(term.text, langId));
  const { clearActiveTerm } = useActiveTermContext();

  return (
    <Tabs defaultValue="termform">
      <Tabs.List>
        <Tabs.Tab value="termform">Term</Tabs.Tab>
        <Tabs.Tab value="sentences" disabled={!data?.variations.length}>
          Sentences
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="termform">
        <Box p={20}>
          <TermForm
            key={term.text}
            term={term}
            showPronunciation={showPronunciationField}
            translationFieldRef={translationFieldRef}
            onSubmitSuccess={clearActiveTerm}
          />
        </Box>
      </Tabs.Panel>

      <Tabs.Panel value="sentences">
        <Box p={20}>
          {data?.variations.length ? (
            <TermVariationsList data={data.variations} />
          ) : (
            <PageSpinner />
          )}
        </Box>
      </Tabs.Panel>
    </Tabs>
  );
}
