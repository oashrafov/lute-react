import { Text } from "@mantine/core";
import type { MRT_Row } from "mantine-react-table";
import type { TermsListItem } from "#term/api/types";
import { TermImage } from "../../TermImage/TermImage";
import { BACKEND_URL } from "#resources/constants";

interface TranslationCell {
  row: MRT_Row<TermsListItem>;
}

export function TranslationCell({ row }: TranslationCell) {
  const img = row.original.image;
  return (
    <>
      <Text size="sm" component="span" style={{ whiteSpace: "pre" }}>
        {row.original.translation}
      </Text>
      {img && <TermImage position="right" src={`${BACKEND_URL}${img}`} />}
    </>
  );
}
