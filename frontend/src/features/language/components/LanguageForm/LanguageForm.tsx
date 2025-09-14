import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import {
  Box,
  Checkbox,
  Divider,
  Fieldset,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconAbc,
  IconAlt,
  IconAnalyzeFilled,
  IconCut,
} from "@tabler/icons-react";
import { FormButtons } from "../../../../components/common/FormButtons/FormButtons";
import LanguageSelect from "./components/LanguageSelect";
import { DictionaryBars } from "./components/DictionaryBars";
import { AddDictionaryButton } from "./components/AddDictionaryButton";
import { useSelectedLanguage } from "../../hooks/useSelectedLanguage";
import { queries as langQueries } from "../../api/queries";
import classes from "./LanguageForm.module.css";

export function LanguageForm() {
  const { t } = useTranslation("form", { keyPrefix: "language" });
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const { data: formValues, isSuccess } = useQuery(langQueries.languageForm());
  const { data: parsers } = useQuery(langQueries.parsers());
  const { language, isSuccess: isLanguageSuccess } = useSelectedLanguage();

  const form = useForm({ initialValues: formValues });

  useEffect(() => {
    if (isSuccess && formValues) {
      form.setInitialValues(formValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues, isSuccess]);

  useEffect(() => {
    if (isLanguageSuccess && language) {
      form.setValues(language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, isLanguageSuccess]);

  useEffect(() => {
    if (!langId) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langId]);

  function handleAddDictionary() {
    form.insertListItem("dictionaries", {
      for: "terms",
      type: "embedded",
      url: "",
      active: false,
      key: randomId(),
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
            <DictionaryBars
              key={form.getValues().dictionaries.length}
              form={form}
            />
          </div>
        </Fieldset>

        <Checkbox
          label={t("pronunciationLabel")}
          key={form.key("show_romanization")}
          {...form.getInputProps("show_romanization", { type: "checkbox" })}
        />

        <Checkbox
          label={t("rtlLabel")}
          key={form.key("right_to_left")}
          {...form.getInputProps("right_to_left", { type: "checkbox" })}
        />

        <Select
          label={t("parseLabel")}
          w="fit-content"
          leftSection={<IconAnalyzeFilled />}
          withCheckIcon={false}
          searchable={false}
          allowDeselect={false}
          data={parsers}
          key={form.key("parser_type")}
          {...form.getInputProps("parser_type")}
        />

        <TextInput
          label={t("charSubsLabel")}
          leftSection={<IconAlt />}
          key={form.key("character_substitutions")}
          {...form.getInputProps("character_substitutions")}
        />

        <Group align="flex-end">
          <TextInput
            label={t("splitLabel")}
            description={t("splitDescription")}
            leftSection={<IconCut />}
            flex={1}
            key={form.key("split_sentences")}
            {...form.getInputProps("split_sentences")}
          />
          <TextInput
            label={t("splitExceptionsLabel")}
            flex={2}
            key={form.key("split_sentence_exceptions")}
            {...form.getInputProps("split_sentence_exceptions")}
          />
        </Group>

        <TextInput
          label={t("wordCharsLabel")}
          description={t("wordCharsDescription")}
          leftSection={<IconAbc />}
          key={form.key("word_chars")}
          {...form.getInputProps("word_chars")}
        />

        <FormButtons />
      </Box>
    </form>
  );
}
