import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { notifications } from "@mantine/notifications";
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
import { TextInput } from "../../../../components/common/TextInput/TextInput";
import { FileInput } from "../../../../components/common/FileInput/FileInput";
import { TagsInput } from "../../../../components/common/TagsInput/TagsInput";
import { NumberInput } from "../../../../components/common/NumberInput/NumberInput";
import { Select } from "../../../../components/common/Select/Select";
import { Textarea } from "../../../../components/common/Textarea/Textarea";
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

  const { control, getValues, setValue, reset, watch, handleSubmit } = useForm({
    defaultValues: formValues,
  });

  const hasTextFile = !!watch("text_file");
  const hasAudioFile = !!watch("audio_file");
  const hasImportURL = !!watch("importurl");

  const createBookMutation = useCreateBook();

  const getBookDataFromUrlMutation = useMutation({
    mutationFn: getBookDataFromUrl,
    onSuccess: (data) => reset(data),
    onError: (error) => notifications.show(errorMessage(error.message)),
  });

  function handlePopulateFromUrl() {
    getBookDataFromUrlMutation.mutate(getValues().importurl);
    setValue("importurl", "");
  }

  return (
    <form
      className={classes.container}
      onSubmit={handleSubmit((data) => createBookMutation.mutate(data))}>
      <TextInput
        name="title"
        control={control}
        wrapperProps={{ dir: textDirection }}
        disabled={language ? false : true}
        required
        withAsterisk
        label={t("titleLabel")}
        leftSection={<IconHeading />}
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
            name="text"
            control={control}
            label={t("textLabel")}
            disabled={hasTextFile}
            wrapperProps={{ dir: textDirection }}
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
              loading={getBookDataFromUrlMutation.isPending}
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
        data={initial!.bookTags}
        leftSection={<IconTags />}
      />

      <FormButtons
        okDisabled={!language}
        okLoading={createBookMutation.isPending}
      />
    </form>
  );
}
