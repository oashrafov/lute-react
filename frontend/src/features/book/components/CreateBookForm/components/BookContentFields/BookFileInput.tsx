import { Button, Group, InputClearButton } from "@mantine/core";
import { IconBookDownload } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FileInput } from "#common/FileInput/FileInput";
import { mutation } from "#book/api/mutation";
import type { CreateBookForm } from "#book/api/types";

export function BookFileInput() {
  const {
    control,
    watch,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateBookForm>();
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const hasTextFile = !!watch("text_file");

  const { mutate, isPending } = mutation.useParseContentFromFile();

  function handleParseFile() {
    const file = getValues().text_file;
    if (file) {
      mutate(file, {
        onSuccess: (data) => {
          setValue("text", data.text);
        },
      });
    }
  }

  const clearButton = hasTextFile && (
    <InputClearButton
      onClick={() => {
        setValue("text_file", null);
        clearErrors("text_file");
      }}
    />
  );

  return (
    <FileInput
      name="text_file"
      control={control}
      label={t("textFileLabel")}
      description=".txt, .epub, .pdf, .srt, .vtt"
      accept="text/plain, application/pdf, .epub, .srt, .vtt"
      leftSection={<IconBookDownload />}
      rightSection={clearButton}
      styles={{ wrapper: { minWidth: 0, flex: 1 } }}
      onChange={(value) => {
        if (value) {
          setValue("title", value.name.slice(0, value.name.lastIndexOf(".")));
        }
      }}
      inputContainer={(input) => (
        <Group wrap="nowrap" align="flex-end">
          {input}
          <Button
            disabled={!hasTextFile || !!errors.text_file?.message}
            variant="filled"
            loading={isPending}
            mb={errors.text_file?.message ? 5 : undefined}
            style={{ flexShrink: 0 }}
            onClick={handleParseFile}>
            {t("importLabel")}
          </Button>
        </Group>
      )}
      error={errors.text_file?.message}
    />
  );
}
