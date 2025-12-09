import { useSuspenseQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InputClearButton } from "@mantine/core";
import {
  IconCut,
  IconBracketsContain,
  IconHeadphones,
  IconLink,
  IconTags,
} from "@tabler/icons-react";
import { FileInput } from "#common/FileInput/FileInput";
import { NumberInput } from "#common/NumberInput/NumberInput";
import { Select } from "#common/Select/Select";
import { TagsInput } from "#common/TagsInput/TagsInput";
import { TextInput } from "#common/TextInput/TextInput";
import { query } from "#settings/api/query";
import type { CreateBookForm } from "#book/api/types";

export function BookExtraOptions() {
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const { data: initial } = useSuspenseQuery(query.init());
  const {
    control,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateBookForm>();

  const hasAudioFile = !!watch("audio_file");
  const clearButton = hasAudioFile && (
    <InputClearButton
      onClick={() => {
        setValue("audio_file", null);
        clearErrors("audio_file");
      }}
    />
  );

  return (
    <>
      <FileInput
        name="audio_file"
        control={control}
        label={t("audioFileLabel")}
        description=".mp3, .m4a, .wav, .ogg, .opus"
        accept="audio/mpeg,audio/ogg,audio/mp4"
        leftSection={<IconHeadphones />}
        rightSection={clearButton}
        error={errors.audio_file?.message}
      />

      <NumberInput
        name="threshold_page_tokens"
        control={control}
        label={t("wordCountLabel")}
        leftSection={<IconBracketsContain />}
        min={1}
        max={1500}
        error={errors.threshold_page_tokens?.message}
      />

      <TextInput
        name="source_uri"
        control={control}
        placeholder="http://"
        label={t("sourceURLLabel")}
        leftSection={<IconLink />}
        error={errors.source_uri?.message}
      />

      <Select
        name="split_by"
        control={control}
        label={t("splitLabel")}
        data={[
          { value: "paragraphs", label: t("paragraphsOption") },
          { value: "sentences", label: t("sentencesOption") },
        ]}
        leftSection={<IconCut />}
        searchable={false}
        allowDeselect={false}
        error={errors.split_by?.message}
      />

      <TagsInput
        name="book_tags"
        control={control}
        label="Tags"
        data={initial.bookTags}
        clearable
        leftSection={<IconTags />}
        error={errors.book_tags?.message}
      />
    </>
  );
}
