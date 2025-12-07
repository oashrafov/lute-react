import { Button, Group } from "@mantine/core";
import { IconWorldWww } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextInput } from "#common/TextInput/TextInput";
import { mutation } from "#book/api/mutation";

export function BookURLInput() {
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const { control, watch, setValue, getValues, reset } = useFormContext();
  const hasImportURL = !!watch("importurl");
  const {
    mutate: generateContentFromURLMutate,
    isPending: generateContentFromURLIsPending,
  } = mutation.useGenerateContentFromURL();

  function handlePopulateFromUrl() {
    generateContentFromURLMutate(getValues().importurl, {
      onSuccess: (data) => reset(data),
    });
    setValue("importurl", "");
  }

  return (
    <Group align="flex-end">
      <TextInput
        name="importurl"
        control={control}
        flex={1}
        label={t("importfromURLLabel")}
        leftSection={<IconWorldWww />}
      />

      <Button
        disabled={!hasImportURL}
        variant="filled"
        loading={generateContentFromURLIsPending}
        onClick={handlePopulateFromUrl}>
        {t("importLabel")}
      </Button>
    </Group>
  );
}
