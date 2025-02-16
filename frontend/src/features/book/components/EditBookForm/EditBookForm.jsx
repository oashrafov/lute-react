import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileInput,
  InputClearButton,
  TagsInput,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconHeading,
  IconHeadphones,
  IconLink,
  IconTags,
} from "@tabler/icons-react";
import FormButtons from "@common/FormButtons/FormButtons";
import { getFormDataFromObj } from "@actions/utils";
import { initialQuery } from "@settings/api/settings";
import { useEditBook } from "@book/api/mutation";

function EditBookForm({ book, onCloseModal }) {
  const { data: initial } = useQuery(initialQuery);
  const editBookMutation = useEditBook();
  const [existingAudioName, setExistingAudioName] = useState(book.audioName);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      title: book.title,
      source_uri: book.source,
      book_tags: book.tags,
      audio_file: undefined,
    },
    transformValues: (values) => ({
      ...values,
      audio_filename: existingAudioName,
    }),
  });

  function handleClearAudio() {
    setExistingAudioName("");
    form.setFieldValue("audio_file", undefined);
  }

  function handleSubmit(data) {
    editBookMutation.mutate({ id: book.id, data: data });
    onCloseModal();
  }

  return (
    <form
      onSubmit={form.onSubmit((data) =>
        handleSubmit(getFormDataFromObj({ ...data, action: "edit" }))
      )}>
      <TextInput
        wrapperProps={{ dir: book.languageRtl ? "rtl" : "ltr" }}
        required
        withAsterisk
        label="Title"
        leftSection={<IconHeading />}
        key={form.key("title")}
        {...form.getInputProps("title")}
      />

      <FileInput
        label="Audio file"
        description=".mp3, .m4a, .wav, .ogg, .opus"
        accept="audio/mpeg, audio/ogg, audio/mp4, audio/wav"
        leftSection={<IconHeadphones />}
        placeholder={
          existingAudioName && (
            <Text component="span" size="sm" lineClamp={1}>
              {existingAudioName}
            </Text>
          )
        }
        styles={{ placeholder: { color: "unset" } }}
        rightSection={
          (existingAudioName || form.getValues().audio_file) && (
            <Tooltip label="Remove audio">
              <InputClearButton onClick={handleClearAudio} />
            </Tooltip>
          )
        }
        key={form.key("audio_file")}
        {...form.getInputProps("audio_file")}
      />

      <TextInput
        label="Source URL"
        leftSection={<IconLink />}
        key={form.key("source_uri")}
        {...form.getInputProps("source_uri")}
      />

      <TagsInput
        label="Tags"
        data={initial.book_tags | []}
        leftSection={<IconTags />}
        key={form.key("book_tags")}
        {...form.getInputProps("book_tags")}
      />

      <FormButtons discardCallback={onCloseModal} />
    </form>
  );
}

export default EditBookForm;
