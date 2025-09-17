import { useState } from "react";
import { InputClearButton, Text, Tooltip } from "@mantine/core";
import { useForm } from "react-hook-form";
import {
  IconHeading,
  IconHeadphones,
  IconLink,
  IconTags,
} from "@tabler/icons-react";
import { FileInput } from "../../../../components/common/FileInput/FileInput";
import { TextInput } from "../../../../components/common/TextInput/TextInput";
import { TagsInput } from "../../../../components/common/TagsInput/TagsInput";
import { FormButtons } from "../../../../components/common/FormButtons/FormButtons";
import { useEditBook } from "../../api/mutation";
import type { BooksListItem, EditAction } from "../../api/types";

interface EditBookForm {
  book: BooksListItem;
  bookTags: string[];
  onCloseModal: () => void;
}

export function EditBookForm({ book, bookTags, onCloseModal }: EditBookForm) {
  const editBookMutation = useEditBook();
  const [existingAudioName, setExistingAudioName] = useState(book.audioName);

  const {
    control,
    setValue,
    watch,
    handleSubmit: handleFormSubmit,
  } = useForm({
    defaultValues: {
      title: book.title,
      source_uri: book.source,
      book_tags: book.tags,
      audio_file: null,
      audio_filename: book.audioName,
    },
  });

  const hasAudioFile = !!watch("audio_file");

  // const form = umf({
  //   mode: "controlled",
  //   initialValues: {
  //     title: book.title,
  //     source_uri: book.source,
  //     book_tags: book.tags,
  //     audio_file: undefined,
  //   },
  //   transformValues: (values) => ({
  //     ...values,
  //     audio_filename: existingAudioName,
  //   }),
  // });

  function handleClearAudio() {
    setExistingAudioName("");
    setValue("audio_file", null);
  }

  function handleSubmit(data: EditAction) {
    editBookMutation.mutate({ id: book.id, data: data });
    onCloseModal();
  }

  return (
    <form
      onSubmit={handleFormSubmit((data) =>
        handleSubmit({
          ...data,
          action: "edit",
        })
      )}>
      <TextInput
        name="title"
        control={control}
        label="Title"
        wrapperProps={{ dir: book.textDirection }}
        required
        withAsterisk
        leftSection={<IconHeading />}
      />

      <FileInput
        name="audio_file"
        control={control}
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
          (existingAudioName || hasAudioFile) && (
            <Tooltip label="Remove audio">
              <InputClearButton onClick={handleClearAudio} />
            </Tooltip>
          )
        }
      />

      <TextInput
        name="source_uri"
        control={control}
        label="Source URL"
        leftSection={<IconLink />}
      />

      <TagsInput
        name="book_tags"
        control={control}
        label="Tags"
        data={bookTags}
        leftSection={<IconTags />}
      />

      <FormButtons discardCallback={onCloseModal} />
    </form>
  );
}
