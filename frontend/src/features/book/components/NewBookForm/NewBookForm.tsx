import { useSearch } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Button,
  Fieldset,
  Group,
  InputClearButton,
  Stack,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconBookUpload,
  IconBracketsContain,
  IconCut,
  IconHeading,
  IconHeadphones,
  IconLink,
  IconTags,
  IconWorldWww,
} from "@tabler/icons-react";
import { TextInput } from "#common/TextInput/TextInput";
import { FileInput } from "#common/FileInput/FileInput";
import { TagsInput } from "#common/TagsInput/TagsInput";
import { NumberInput } from "#common/NumberInput/NumberInput";
import { Select } from "#common/Select/Select";
import { Textarea } from "#common/Textarea/Textarea";
import { FormButtons } from "#common/FormButtons/FormButtons";
import { ImportURLInfoPopup } from "./components/ImportURLInfoPopup";
import { query as settingsQuery } from "#settings/api/query";
import { query as bookQuery } from "#book/api/query";
import { query as langQuery } from "#language/api/query";
import { mutation } from "#book/api/mutation";
import classes from "./NewBookForm.module.css";

export function NewBookForm() {
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const { langId, textDir } = useSearch({ strict: false });
  const { data: language } = useQuery(langQuery.userLanguageDetail(langId));
  const { data: formValues } = useSuspenseQuery(bookQuery.bookForm());
  const { data: initial } = useSuspenseQuery(settingsQuery.init());
  const { mutate: createBookMutate } = mutation.useCreateBook();
  const {
    mutate: generateContentFromURLMutate,
    isPending: generateContentFromURLIsPending,
  } = mutation.useGenerateContentFromURL();

  const {
    control,
    getValues,
    setValue,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: formValues,
  });

  const hasTextFile = !!watch("text_file");
  const hasAudioFile = !!watch("audio_file");
  const hasImportURL = !!watch("importurl");

  function handlePopulateFromUrl() {
    generateContentFromURLMutate(getValues().importurl, {
      onSuccess: (data) => reset(data),
    });
    setValue("importurl", "");
  }

  return (
    <form
      className={classes.container}
      onSubmit={handleSubmit((data) =>
        createBookMutate({ ...data, language_id: String(langId) })
      )}>
      <TextInput
        name="title"
        control={control}
        wrapperProps={{ dir: textDir }}
        disabled={!language}
        required
        withAsterisk
        label={t("titleLabel")}
        leftSection={<IconHeading />}
      />

      <Fieldset
        disabled={!language}
        variant="filled"
        legend={t("contentLabel")}
        flex={1}
        styles={{
          legend: { fontWeight: 500 },
        }}>
        <Stack style={{ flexWrap: "nowrap" }} gap={5}>
          <Textarea
            name="text"
            control={control}
            label={t("textLabel")}
            disabled={hasTextFile}
            wrapperProps={{ dir: textDir }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            resize="vertical"
            autosize
            minRows={15}
            maxRows={25}
          />

          <p>{t("or")}</p>

          <FileInput
            name="text_file"
            control={control}
            label={t("textFileLabel")}
            description=".txt, .epub, .pdf, .srt, .vtt"
            accept="text/plain, application/pdf, .epub, .srt, .vtt"
            leftSection={<IconBookUpload />}
            rightSection={
              hasTextFile && (
                <InputClearButton onClick={() => setValue("text_file", null)} />
              )
            }
            onChange={(value) => {
              if (value) {
                setValue(
                  "title",
                  value.name.slice(0, value.name.lastIndexOf("."))
                );
              }
            }}
          />

          <p>{t("or")}</p>

          <Group align="flex-end">
            <TextInput
              name="importurl"
              control={control}
              disabled={hasTextFile}
              flex={1}
              label={t("importfromURLLabel")}
              leftSection={<IconWorldWww />}
              rightSection={<ImportURLInfoPopup />}
            />

            <Button
              disabled={!hasImportURL || hasTextFile}
              variant="filled"
              loading={generateContentFromURLIsPending}
              onClick={handlePopulateFromUrl}>
              {t("importLabel")}
            </Button>
          </Group>
        </Stack>
      </Fieldset>

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

      <NumberInput
        name="threshold_page_tokens"
        control={control}
        label={t("wordCountLabel")}
        leftSection={<IconBracketsContain />}
      />

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

      <TextInput
        name="source_uri"
        control={control}
        label={t("sourceURLLabel")}
        leftSection={<IconLink />}
      />

      <TagsInput
        name="book_tags"
        control={control}
        label="Tags"
        data={initial.bookTags}
        leftSection={<IconTags />}
      />

      <FormButtons okDisabled={!language} okLoading={isSubmitting} />
    </form>
  );
}
