import { useQuery } from "@tanstack/react-query";
import { Button, Fieldset, Group, rem, Stack } from "@mantine/core";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  IconDatabase,
  IconTorii,
  IconNotes,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { Checkbox } from "#common/Checkbox/Checkbox";
import { TextInput } from "#common/TextInput/TextInput";
import { NumberInput } from "#common/NumberInput/NumberInput";
import { Select } from "#common/Select/Select";
import { FormButtons } from "#common/FormButtons/FormButtons";
import { MeCabInfo } from "./MeCabInfo";
import { queries } from "#settings/api/queries";

export function SettingsForm() {
  const { t } = useTranslation("form", { keyPrefix: "settings" });
  const { data: settings } = useQuery(queries.settingsForm());

  const { control, watch } = useForm({
    defaultValues: settings,
  });

  const isBackupEnabled = watch("backup_enabled", true);

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
              name="backup_enabled"
              control={control}
              label={t("backupEnabledLabel")}
            />
            <TextInput
              name="backup_dir"
              control={control}
              label={t("backupDirLabel")}
              leftSection={<IconDatabase />}
              disabled={!isBackupEnabled}
            />
            <Checkbox
              name="backup_auto"
              control={control}
              label={t("backupAutoLabel")}
              disabled={!isBackupEnabled}
            />
            <Checkbox
              name="backup_warn"
              control={control}
              label={t("backupWarnLabel")}
              disabled={!isBackupEnabled}
            />
            <Checkbox
              name="backup_count"
              control={control}
              label={t("backupCountLabel")}
              disabled={!isBackupEnabled}
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
              name="open_popup_in_new_tab"
              control={control}
              label={t("openInNewTabLabel")}
            />
            <Checkbox
              name="stop_audio_on_term_form_open"
              control={control}
              label={t("stopAudioLabel")}
            />
            {/* <Checkbox
              name="focusActiveSentence"
              control={control}
              label={t("focusActiveSentenceLabel")}
            /> */}
            <NumberInput
              name="stats_calc_sample_size"
              control={control}
              label={t("statsSampleSizeLabel")}
              leftSection={<IconNotes />}
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
              name="term_popup_promote_parent_translation"
              control={control}
              label={t("promoteParentLabel")}
            />
            <Checkbox
              name="term_popup_show_components"
              control={control}
              label={t("showComponentTermsLabel")}
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
                name="mecab_path"
                control={control}
                label={t("mecabPathLabel")}
                leftSection={<IconTorii />}
                rightSection={<MeCabInfo />}
                flex={1}
              />
              <Button>{t("testMecabConfigLabel")}</Button>
            </Group>
            <Select
              name="japanese_reading"
              control={control}
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
            />
          </Stack>
        </Fieldset>
      </Stack>

      <FormButtons />
    </form>
  );
}
