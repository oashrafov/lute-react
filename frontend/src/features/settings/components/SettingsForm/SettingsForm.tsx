import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Fieldset,
  Group,
  NumberInput,
  rem,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconDatabase,
  IconTorii,
  IconNotes,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { MeCabInfo } from "./MeCabInfo";
import { FormButtons } from "../../../../components/common/FormButtons/FormButtons";
import { queries } from "../../api/queries";

export function SettingsForm() {
  const { t } = useTranslation("form", { keyPrefix: "settings" });
  const { data: settings } = useQuery(queries.settings());

  const form = useForm({
    mode: "controlled",
    initialValues: {
      ...settings,
      focusActiveSentence: true,
    },
    enhanceGetInputProps: ({ form, field }) => {
      const enabledField = "backup_enabled";
      if (field.includes("backup") && field !== enabledField) {
        return { disabled: !form.getValues()[enabledField] };
      }
    },
  });

  const fieldsetFz = rem(17);
  return (
    <form>
      <Stack gap={10}>
        <Fieldset
          legend={t("backupLabel")}
          variant="filled"
          styles={{
            legend: { fontSize: fieldsetFz, fontWeight: 500 },
          }}>
          <Stack gap={5}>
            <Checkbox
              label={t("backupEnabledLabel")}
              key={form.key("backup_enabled")}
              {...form.getInputProps("backup_enabled", { type: "checkbox" })}
            />
            <TextInput
              label={t("backupDirLabel")}
              leftSection={<IconDatabase />}
              key={form.key("backup_dir")}
              {...form.getInputProps("backup_dir")}
            />
            <Checkbox
              label={t("backupAutoLabel")}
              key={form.key("backup_auto")}
              {...form.getInputProps("backup_auto", { type: "checkbox" })}
            />
            <Checkbox
              label={t("backupWarnLabel")}
              key={form.key("backup_warn")}
              {...form.getInputProps("backup_warn", { type: "checkbox" })}
            />
            <Checkbox
              label={t("backupCountLabel")}
              key={form.key("backup_count")}
              {...form.getInputProps("backup_count", { type: "checkbox" })}
            />
          </Stack>
        </Fieldset>
        <Fieldset
          legend={t("behaviourLabel")}
          variant="filled"
          styles={{
            legend: {
              fontSize: fieldsetFz,
              fontWeight: 500,
            },
          }}>
          <Stack gap={5} align="flex-start">
            <Checkbox
              label={t("openInNewTabLabel")}
              key={form.key("open_popup_in_new_tab")}
              {...form.getInputProps("open_popup_in_new_tab", {
                type: "checkbox",
              })}
            />
            <Checkbox
              label={t("stopAudioLabel")}
              key={form.key("stop_audio_on_term_form_open")}
              {...form.getInputProps("stop_audio_on_term_form_open", {
                type: "checkbox",
              })}
            />
            <Checkbox
              label={t("focusActiveSentenceLabel")}
              key={form.key("focusActiveSentence")}
              {...form.getInputProps("focusActiveSentence", {
                type: "checkbox",
              })}
            />
            <NumberInput
              label={t("statsSampleSizeLabel")}
              leftSection={<IconNotes />}
              key={form.key("stats_calc_sample_size")}
              {...form.getInputProps("stats_calc_sample_size")}
            />
          </Stack>
        </Fieldset>
        <Fieldset
          legend={t("popupsLabel")}
          variant="filled"
          styles={{
            legend: {
              fontSize: fieldsetFz,
              fontWeight: 500,
            },
          }}>
          <Stack gap={5} align="flex-start">
            <Checkbox
              label={t("promoteParentLabel")}
              key={form.key("term_popup_promote_parent_translation")}
              {...form.getInputProps("term_popup_promote_parent_translation", {
                type: "checkbox",
              })}
            />
            <Checkbox
              label={t("showComponentTermsLabel")}
              key={form.key("term_popup_show_components")}
              {...form.getInputProps("term_popup_show_components", {
                type: "checkbox",
              })}
            />
          </Stack>
        </Fieldset>
        <Fieldset
          legend={t("japaneseLabel")}
          variant="filled"
          styles={{
            legend: { fontSize: fieldsetFz, fontWeight: 500 },
          }}>
          <Stack gap={5}>
            <Group gap={5} align="flex-end" wrap="nowrap">
              <TextInput
                label={t("mecabPathLabel")}
                leftSection={<IconTorii />}
                rightSection={<MeCabInfo />}
                flex={1}
                key={form.key("mecab_path")}
                {...form.getInputProps("mecab_path")}
              />
              <Button>{t("testMecabConfigLabel")}</Button>
            </Group>
            <Select
              label="Pronunciation characters"
              withCheckIcon={false}
              searchable={false}
              allowDeselect={false}
              leftSection={<IconSpeakerphone />}
              styles={{ root: { alignSelf: "flex-start" } }}
              data={[
                { label: t("katakana"), value: "katakana" },
                { label: t("hiragana"), value: "hiragana" },
                { label: t("romanji"), value: "romanji" },
              ]}
              key={form.key("japanese_reading")}
              {...form.getInputProps("japanese_reading")}
            />
          </Stack>
        </Fieldset>
      </Stack>

      <FormButtons />
    </form>
  );
}
