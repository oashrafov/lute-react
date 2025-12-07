import { useSuspenseQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Paper } from "@mantine/core";
import { InfoRow } from "./InfoRow";
import { Label } from "./Label";
import { query } from "#language/api/query";
import type { CreateBookForm } from "#book/api/types";

export function NewBookReviewInfo() {
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const { data: languages } = useSuspenseQuery(query.userLanguagesList());
  const { getValues } = useFormContext<CreateBookForm>();
  const values = getValues();
  return (
    <Paper p="lg" withBorder w="100%">
      <InfoRow>
        <Label>{`${t("titleLabel")}:`}</Label> {values.title}
      </InfoRow>
      <InfoRow>
        <Label>{`${t("languageNameLabel")}:`}</Label>
        {languages.find((lang) => lang.id === Number(values.language_id))?.name}
      </InfoRow>
      <InfoRow>
        <Label>{`${t("wordCountLabel")}:`}</Label>{" "}
        {values.threshold_page_tokens}
      </InfoRow>
      <InfoRow>
        <Label>{`${t("splitLabel")}:`}</Label> {values.split_by}
      </InfoRow>
      {values.source_uri && (
        <InfoRow>
          <Label>{`${t("sourceURLLabel")}:`}</Label> {values.source_uri}
        </InfoRow>
      )}
      {values.audio_file && (
        <InfoRow>
          <Label>{`${t("audioFileLabel")}:`}</Label> {values.audio_file.name}
        </InfoRow>
      )}
      {values.book_tags.length > 0 && (
        <InfoRow>
          <Label>{`${t("tagsLabel")}:`}</Label> {values.book_tags}
        </InfoRow>
      )}
    </Paper>
  );
}
