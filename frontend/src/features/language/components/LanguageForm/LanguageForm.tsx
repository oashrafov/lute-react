import { useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { Box, Divider, Fieldset, Group, LoadingOverlay } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import {
  IconAbc,
  IconAlt,
  IconAnalyzeFilled,
  IconCut,
} from "@tabler/icons-react";
import { Checkbox } from "#common/Checkbox/Checkbox";
import { Select } from "#common/Select/Select";
import { TextInput } from "#common/TextInput/TextInput";
import { FormButtons } from "#common/FormButtons/FormButtons";
import { LanguageSelect } from "./components/LanguageSelect";
import { DictionaryBars } from "./components/DictionaryBars";
import { AddDictionaryButton } from "./components/AddDictionaryButton";
import { useSelectedLanguage } from "#language/hooks/useSelectedLanguage";
import { query } from "#language/api/query.js";
import type { Dictionary, LanguageForm } from "#language/api/types";
import classes from "./LanguageForm.module.css";

export function LanguageForm() {
  const { t } = useTranslation("form", { keyPrefix: "language" });
  const { langId, langName } = useSearch({ strict: false });
  const { data: initialValues, isSuccess } = useQuery(query.languageForm());
  const { data: parsers } = useQuery(query.parsers());
  const { language, isSuccess: isLanguageSuccess } = useSelectedLanguage();

  const { control, setValue, reset } = useForm({
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dictionaries",
  });

  useEffect(() => {
    if (isLanguageSuccess && language) {
      reset(language);
    }
  }, [language, isLanguageSuccess, reset]);

  useEffect(() => {
    if (!langId && isSuccess) {
      reset(initialValues);
    }
  }, [langId, isSuccess, reset, initialValues]);

  useEffect(() => {
    if (!langName && isSuccess) {
      reset(initialValues);
    }
  }, [langName, isSuccess, reset, initialValues]);

  function handleAddDictionary() {
    append({
      for: "terms",
      type: "embedded",
      url: "",
      active: false,
      hostname: "",
      id: parseInt(randomId()),
      label: "",
    });
  }

  return (
    <form>
      <LanguageSelect />

      <Divider mt="md" mb="xs" />

      <Box pos="relative" className={classes.container}>
        <LoadingOverlay
          visible={!!(!isSuccess && langId)}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Fieldset
          variant="filled"
          legend={t("dictionariesLabel")}
          styles={{
            legend: { fontWeight: 500 },
          }}>
          <div className={classes.flex}>
            <AddDictionaryButton onClick={handleAddDictionary} />
            <DictionaryBars<LanguageForm>
              key={`${langId}${langName}`}
              dictionaries={fields}
              control={control}
              onSet={(dicts: Dictionary[]) => setValue("dictionaries", dicts)}
              onRemove={(index: number) => remove(index)}
            />
          </div>
        </Fieldset>

        <Checkbox
          name="show_romanization"
          control={control}
          label={t("pronunciationLabel")}
        />

        <Checkbox
          name="show_romanization"
          control={control}
          label={t("rtlLabel")}
        />

        <Select
          name="parser_type"
          control={control}
          label={t("parseLabel")}
          w="fit-content"
          leftSection={<IconAnalyzeFilled />}
          withCheckIcon={false}
          searchable={false}
          allowDeselect={false}
          data={parsers}
        />

        <TextInput
          name="character_substitutions"
          control={control}
          label={t("charSubsLabel")}
          leftSection={<IconAlt />}
        />

        <Group align="flex-end">
          <TextInput
            name="split_sentences"
            control={control}
            label={t("splitLabel")}
            description={t("splitDescription")}
            leftSection={<IconCut />}
            flex={1}
          />
          <TextInput
            name="split_sentence_exceptions"
            control={control}
            label={t("splitExceptionsLabel")}
            flex={2}
          />
        </Group>

        <TextInput
          name="word_chars"
          control={control}
          label={t("wordCharsLabel")}
          description={t("wordCharsDescription")}
          leftSection={<IconAbc />}
        />

        <FormButtons />
      </Box>
    </form>
  );
}
