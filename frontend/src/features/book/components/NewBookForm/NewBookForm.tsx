import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Fieldset,
  FileInput,
  Group,
  NumberInput,
  Select,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
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
import { FormButtons } from "../../../../components/common/FormButtons/FormButtons";
import { errorMessage } from "../../../../resources/notifications";
import { getBookDataFromUrl } from "../../api/api";
import { useCreateBook } from "../../api/mutation";
import { ImportURLInfoPopup } from "./components/ImportURLInfoPopup";
import { queries as settingsQueries } from "../../../settings/api/queries";
import { queries as bookQueries } from "../../api/queries";
import { useUserLanguageQuery } from "../../../language/hooks/useUserLanguageQuery";
import classes from "./NewBookForm.module.css";

export function NewBookForm() {
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const { data: formValues } = useQuery(bookQueries.bookForm());
  const { data: language } = useUserLanguageQuery(Number(langId));
  const { data: initial } = useQuery(settingsQueries.init());
  const textDirection = language?.right_to_left ? "rtl" : "ltr";

  const form = useForm({ initialValues: formValues });

  const createBookMutation = useCreateBook();

  const getBookDataFromUrlMutation = useMutation({
    mutationFn: getBookDataFromUrl,
    onSuccess: (data) => form.setValues(data),
    onError: (error) => notifications.show(errorMessage(error.message)),
  });

  function handlePopulateFromUrl() {
    getBookDataFromUrlMutation.mutate(form.getValues().importurl);
    form.setFieldValue("importurl", "");
  }

  return (
    <form
      className={classes.container}
      onSubmit={form.onSubmit((data) => createBookMutation.mutate(data))}>
      <TextInput
        wrapperProps={{ dir: textDirection }}
        disabled={language ? false : true}
        required
        withAsterisk
        label={t("titleLabel")}
        leftSection={<IconHeading />}
        key={form.key("title")}
        {...form.getInputProps("title")}
      />
      <Fieldset
        disabled={language ? false : true}
        variant="filled"
        legend={t("contentLabel")}
        flex={1}
        styles={{
          legend: { fontWeight: 500 },
        }}>
        <Stack style={{ flexWrap: "nowrap" }} gap={5}>
          <Textarea
            label={t("textLabel")}
            disabled={!!form.getValues().text_file}
            wrapperProps={{ dir: textDirection }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            resize="vertical"
            autosize
            minRows={15}
            maxRows={25}
            key={form.key("text")}
            {...form.getInputProps("text")}
          />

          <p>{t("or")}</p>

          <FileInput
            label={t("textFileLabel")}
            description=".txt, .epub, .pdf, .srt, .vtt"
            accept="text/plain, application/pdf, .epub, .srt, .vtt"
            leftSection={<IconBookUpload />}
            clearable
            key={form.key("text_file")}
            {...form.getInputProps("text_file")}
            // value={form.getValues().text_file}
            onChange={(value) => {
              if (value) {
                form.setFieldValue(
                  "title",
                  value.name.slice(0, value.name.lastIndexOf("."))
                );
                form.setFieldValue("text_file", value);
              }
              // setTextFile(value);
            }}
          />

          <p>{t("or")}</p>

          <Group align="flex-end">
            <TextInput
              disabled={!!form.getValues().text_file}
              flex={1}
              label={t("importfromURLLabel")}
              leftSection={<IconWorldWww />}
              rightSection={<ImportURLInfoPopup />}
              key={form.key("importurl")}
              {...form.getInputProps("importurl")}
            />
            <Button
              disabled={
                !!(!form.getValues().importurl || form.getValues().text_file)
              }
              variant="filled"
              loading={getBookDataFromUrlMutation.isPending}
              onClick={handlePopulateFromUrl}>
              Import
            </Button>
          </Group>
        </Stack>
      </Fieldset>

      <Select
        label={t("splitLabel")}
        data={[
          { value: "paragraphs", label: t("paragraphsOption") },
          { value: "sentences", label: t("sentencesOption") },
        ]}
        leftSection={<IconCut />}
        withCheckIcon={false}
        searchable={false}
        allowDeselect={false}
        key={form.key("split_by")}
        {...form.getInputProps("split_by")}
      />

      <NumberInput
        label={t("wordCountLabel")}
        key={form.key("threshold_page_tokens")}
        {...form.getInputProps("threshold_page_tokens")}
        leftSection={<IconBracketsContain />}
      />

      <FileInput
        label={t("audioFileLabel")}
        description=".mp3, .m4a, .wav, .ogg, .opus"
        accept="audio/mpeg,audio/ogg,audio/mp4"
        leftSection={<IconHeadphones />}
        clearable
        key={form.key("audio_file")}
        {...form.getInputProps("audio_file")}
        // onChange={(v) => form.setFieldValue("audio_file", v)}
      />

      <TextInput
        label={t("sourceURLLabel")}
        leftSection={<IconLink />}
        key={form.key("source_uri")}
        {...form.getInputProps("source_uri")}
      />

      <TagsInput
        label="Tags"
        data={initial.bookTags}
        leftSection={<IconTags />}
        key={form.key("book_tags")}
        {...form.getInputProps("book_tags")}
      />

      <FormButtons
        okDisabled={!language}
        okLoading={createBookMutation.isPending}
      />
    </form>
  );
}
