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
import FormButtons from "@common/FormButtons/FormButtons";
import { userLanguageQuery } from "@language/api/query";
import { initialQuery } from "@settings/api/settings";
import { errorMessage } from "@resources/notifications";
import { getBookDataFromUrl } from "../../api/api";
import { useCreateBook } from "@book/api/mutation";
import useNewBookForm from "@book/hooks/useNewBookForm";
import ImportURLInfoPopup from "./components/ImportURLInfoPopup";
import classes from "./NewBookForm.module.css";

function NewBookForm() {
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const { data: language } = useQuery(userLanguageQuery(langId));
  const { data: initial } = useQuery(initialQuery);
  const dir = language?.right_to_left ? "rtl" : "ltr";

  const form = useNewBookForm(langId);

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
      onSubmit={form.onSubmit(createBookMutation.mutate)}>
      <TextInput
        wrapperProps={{ dir: dir }}
        disabled={language ? false : true}
        required
        withAsterisk
        label="Title"
        leftSection={<IconHeading />}
        key={form.key("title")}
        {...form.getInputProps("title")}
      />
      <Fieldset
        disabled={language ? false : true}
        variant="filled"
        legend="Content"
        flex={1}
        styles={{
          legend: { fontWeight: 500 },
        }}>
        <Stack wrap="nowrap" gap={5}>
          <Textarea
            disabled={form.getValues().text_file}
            wrapperProps={{ dir: dir }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            label="Text"
            resize="vertical"
            autosize
            minRows={15}
            maxRows={25}
            key={form.key("text")}
            {...form.getInputProps("text")}
          />

          <p>or</p>

          <FileInput
            label="Import from file"
            description=".txt, .epub, .pdf, .srt, .vtt"
            accept="text/plain, application/pdf, .epub, .srt, .vtt"
            leftSection={<IconBookUpload />}
            clearable
            key={form.key("text_file")}
            {...form.getInputProps("text_file")}
            // value={form.getValues().text_file}
            onChange={(value) => {
              // console.log(value);
              if (value) {
                form.setFieldValue(
                  "title",
                  value.name.slice(0, value.name.lastIndexOf("."))
                );
              }
              form.setFieldValue("text_file", value);
              // setTextFile(value);
            }}
          />

          <p>or</p>

          <Group align="flex-end">
            <TextInput
              disabled={form.getValues().text_file}
              flex={1}
              label="Import from URL"
              leftSection={<IconWorldWww />}
              rightSection={<ImportURLInfoPopup />}
              key={form.key("importurl")}
              {...form.getInputProps("importurl")}
            />
            <Button
              disabled={
                !form.getValues().importurl || form.getValues().text_file
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
        label="Split by"
        data={[
          { value: "paragraphs", label: "Paragraphs" },
          { value: "sentences", label: "Sentences" },
        ]}
        leftSection={<IconCut />}
        withCheckIcon={false}
        searchable={false}
        allowDeselect={false}
        key={form.key("split_by")}
        {...form.getInputProps("split_by")}
      />

      <NumberInput
        label="Words per page"
        key={form.key("threshold_page_tokens")}
        {...form.getInputProps("threshold_page_tokens")}
        leftSection={<IconBracketsContain />}
      />

      <FileInput
        label="Audio file"
        description=".mp3, .m4a, .wav, .ogg, .opus"
        accept="audio/mpeg,audio/ogg,audio/mp4"
        leftSection={<IconHeadphones />}
        clearable
        key={form.key("audio_file")}
        {...form.getInputProps("audio_file")}
        // onChange={(v) => form.setFieldValue("audio_file", v)}
      />

      <TextInput
        label="Source URL"
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

export default NewBookForm;
