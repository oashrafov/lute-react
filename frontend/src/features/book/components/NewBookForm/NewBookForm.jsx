import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  ActionIcon,
  Button,
  Fieldset,
  FileInput,
  Group,
  NumberInput,
  Paper,
  Popover,
  rem,
  Select,
  Stack,
  TagsInput,
  Text,
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
  IconQuestionMark,
  IconSquareRoundedPlusFilled,
  IconTags,
  IconWorldWww,
} from "@tabler/icons-react";
import LanguageCards from "@language/components/LanguageCards/LanguageCards";
import FormButtons from "@common/FormButtons/FormButtons";
import { defFormSettingsQuery } from "@language/api/language";
import { initialQuery } from "@settings/api/settings";
import { errorMessage } from "@resources/notifications";
import { createBook, getBookDataFromUrl } from "../../api/api";
import { getFormDataFromObj } from "@actions/utils";
import classes from "./NewBookForm.module.css";

function NewBookForm({ openDrawer }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const isLangSelected = langId && langId !== "0";
  const { data } = useQuery(defFormSettingsQuery(langId));
  const { data: initial } = useQuery(initialQuery);
  const dir = data?.right_to_left ? "rtl" : "ltr";

  const form = useForm({
    initialValues: {
      language_id: "",
      title: "",
      text: "",
      importurl: "",
      text_file: undefined,
      audio_file: undefined,
      threshold_page_tokens: 250,
      split_by: "paragraphs",
      source_uri: "",
      book_tags: [],
    },
    transformValues: (values) => {
      const data = {
        ...values,
        language_id: Number(langId),
      };

      return getFormDataFromObj(data);
    },
  });

  const cardsRadioLabel = (
    <Group wrap="nowrap" gap={5} align="center">
      <Text component="span" fw={500} fz="sm">
        Language
      </Text>
      <ActionIcon
        variant="transparent"
        color="green.6"
        onClick={openDrawer}
        size="sm">
        <IconSquareRoundedPlusFilled />
      </ActionIcon>
    </Group>
  );

  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: (response) => navigate(`/books/${response.id}/pages/1`),
    onError: (error) => notifications.show(errorMessage(error.message)),
  });

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
      {initial.haveLanguages ? (
        <LanguageCards
          label={cardsRadioLabel}
          description="Choose language for your book or create new"
        />
      ) : (
        cardsRadioLabel
      )}
      <TextInput
        wrapperProps={{ dir: dir }}
        disabled={isLangSelected ? false : true}
        required
        withAsterisk
        label="Title"
        leftSection={<IconHeading />}
        key={form.key("title")}
        {...form.getInputProps("title")}
      />
      <Fieldset
        disabled={isLangSelected ? false : true}
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
              rightSection={<ImportURLInfo />}
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
        okDisabled={!isLangSelected}
        okLoading={createBookMutation.isPending}
      />
    </form>
  );
}

function ImportURLInfo() {
  return (
    <Popover position="top" withArrow shadow="sm">
      <Popover.Target>
        <ActionIcon variant="transparent">
          <IconQuestionMark />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Paper maw={500} fz="sm">
          <p style={{ marginBottom: rem(5) }}>
            This import is very primitive -- it grabs <em>all</em> the headings
            and text from an HTML page.
          </p>
          <p>
            This will likely include stuff you don&apos;t want. You are able to
            edit the resulting text
          </p>
        </Paper>
      </Popover.Dropdown>
    </Popover>
  );
}

export default NewBookForm;
