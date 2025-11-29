import type { ReactNode } from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HoverCard, ScrollAreaAutosize } from "@mantine/core";
import { SentenceTextPreview } from "#term/components/SentenceTextPreview/SentenceTextPreview.tsx";
import { query } from "#book/api/query";
import type { SentenceRef } from "#term/api/types";

interface SentenceReferenceHoverCard {
  children: ReactNode;
  referenceData: SentenceRef;
}

export function SentenceReferenceHoverCard({
  children,
  referenceData,
}: SentenceReferenceHoverCard) {
  const { textDir } = useSearch({ strict: false });
  const { data: page } = useQuery(
    query.page(referenceData.bookId, referenceData.pageNumber)
  );
  return (
    <HoverCard width={280} shadow="md">
      <HoverCard.Target>{children}</HoverCard.Target>
      <HoverCard.Dropdown w={600} hidden={!page}>
        {page && textDir && (
          <ScrollAreaAutosize mah={300} type="hover">
            <SentenceTextPreview
              paragraphs={page.paragraphs}
              sentenceId={referenceData.sentenceId}
              textDir={textDir}
            />
          </ScrollAreaAutosize>
        )}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
