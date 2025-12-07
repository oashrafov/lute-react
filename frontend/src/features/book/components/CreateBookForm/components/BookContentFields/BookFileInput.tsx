import { Button, Group, InputClearButton } from "@mantine/core";
import { IconBookUpload } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FileInput } from "#common/FileInput/FileInput";
import { mutation } from "#book/api/mutation";
import { type CreateBookForm } from "#book/api/types";

export function BookFileInput() {
  const { control, watch, setValue, getValues } =
    useFormContext<CreateBookForm>();
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const hasTextFile = !!watch("text_file");

  const { mutate, isPending } = mutation.useParseContentFromFile();

  function handleParseFile() {
    const file = getValues("text_file");
    if (file) {
      mutate(file, {
        onSuccess: (data) => {
          setValue("text", data.text);
        },
      });
    }
  }

  return (
    <Group align="flex-end" wrap="nowrap">
      <FileInput
        name="text_file"
        control={control}
        label={t("textFileLabel")}
        description=".txt, .epub, .pdf, .srt, .vtt"
        accept="text/plain, application/pdf, .epub, .srt, .vtt"
        leftSection={<IconBookUpload />}
        flex={1}
        rightSection={
          hasTextFile && (
            <InputClearButton onClick={() => setValue("text_file", null)} />
          )
        }
        onChange={(value) => {
          if (value) {
            setValue("title", value.name.slice(0, value.name.lastIndexOf(".")));
          }
        }}
      />
      <Button
        disabled={!hasTextFile}
        variant="filled"
        loading={isPending}
        onClick={handleParseFile}>
        {t("importLabel")}
      </Button>
    </Group>
  );
}
