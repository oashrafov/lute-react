import { useState } from "react";
import { InputClearButton, Text, Tooltip } from "@mantine/core";
import { useForm } from "react-hook-form";
import {
  IconHeading,
  IconHeadphones,
  IconLink,
  IconTags,
} from "@tabler/icons-react";
import { FileInput } from "#common/FileInput/FileInput";
import { TextInput } from "#common/TextInput/TextInput";
import { TagsInput } from "#common/TagsInput/TagsInput";
import { FormButtons } from "#common/FormButtons/FormButtons";
import { mutation } from "#book/api/mutation";
import type { EditAction, EditBookForm } from "#book/api/types";
import type { TextDirection } from "#resources/types";

interface EditBookFormProps {
  book: EditBookForm;
  textDirection: TextDirection;
  bookTags: string[];
  onCloseModal: () => void;
}

export function EditBookForm({
  book,
  bookTags,
  onCloseModal,
  textDirection,
}: EditBookFormProps) {
  const { id, ...defaultValues } = book;
  const { mutate } = mutation.useEditBook();
  const [existingAudioName, setExistingAudioName] = useState(book.audioName);

  const {
    control,
    setValue,
    watch,
    handleSubmit: handleFormSubmit,
  } = useForm<typeof defaultValues>({ defaultValues });

  const hasAudioFile = !!watch("audioFile");

  function handleClearAudio() {
    setExistingAudioName("");
    setValue("audioFile", null);
  }

  function handleSubmit(data: EditAction) {
    mutate({ id: book.id, data: data });
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
        wrapperProps={{ dir: textDirection }}
        required
        withAsterisk
        leftSection={<IconHeading />}
      />

      <FileInput
        name="audioFile"
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
        name="source"
        control={control}
        label="Source URL"
        leftSection={<IconLink />}
      />

      <TagsInput
        name="tags"
        control={control}
        label="Tags"
        data={bookTags}
        leftSection={<IconTags />}
      />

      <FormButtons discardCallback={onCloseModal} />
    </form>
  );
}
