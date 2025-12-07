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

export function BookExtraOptions() {
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const { data: initial } = useSuspenseQuery(query.init());
  const { control, setValue, watch } = useFormContext();

  const hasAudioFile = !!watch("audio_file");
  return (
    <>
      <FileInput
        name="audio_file"
        control={control}
        label={t("audioFileLabel")}
        description=".mp3, .m4a, .wav, .ogg, .opus"
        accept="audio/mpeg,audio/ogg,audio/mp4"
        leftSection={<IconHeadphones />}
        rightSection={
          hasAudioFile && (
            <InputClearButton onClick={() => setValue("audio_file", null)} />
          )
        }
      />

      <NumberInput
        name="threshold_page_tokens"
        control={control}
        label={t("wordCountLabel")}
        leftSection={<IconBracketsContain />}
      />

      <TextInput
        name="source_uri"
        control={control}
        label={t("sourceURLLabel")}
        leftSection={<IconLink />}
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
        withCheckIcon={false}
        searchable={false}
        allowDeselect={false}
      />

      <TagsInput
        name="book_tags"
        control={control}
        label="Tags"
        data={initial.bookTags}
        leftSection={<IconTags />}
      />
    </>
  );
}
