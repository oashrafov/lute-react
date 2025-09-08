import {
  ActionIcon,
  Checkbox,
  FileInput,
  Group,
  Stack,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCsv, IconQuestionMark } from "@tabler/icons-react";
import { FormButtons } from "../../../../../components/common/FormButtons/FormButtons";

export function TermImportForm() {
  const form = useForm({
    initialValues: {
      importNewOnly: false,
      setToUnknown: false,
      updateExisting: false,
      file: null,
    },
  });

  return (
    <form>
      <Stack gap={5}>
        <Checkbox
          label="Import new terms only"
          key={form.key("importNewOnly")}
          {...form.getInputProps("importNewOnly", { type: "checkbox" })}
        />

        <Checkbox
          label="Set new to Unknown"
          key={form.key("setToUnknown")}
          {...form.getInputProps("setToUnknown", { type: "checkbox" })}
        />

        <Checkbox
          label="Update existing"
          key={form.key("updateExisting")}
          {...form.getInputProps("updateExisting", { type: "checkbox" })}
        />

        <FileInput
          label="Browse CSV"
          accept="text/csv"
          leftSection={<IconCsv />}
          clearable
          key={form.key("file")}
          {...form.getInputProps("file")}
        />
      </Stack>

      <Group justify="space-between" align="center" wrap="nowrap" mt="xs">
        <Tooltip label='Go to help page for "Bulk Import"'>
          <ActionIcon
            component="a"
            href="https://luteorg.github.io/lute-manual/usage/terms/bulk-term-import.html"
            target="_blank"
            variant="light"
            radius="xl">
            <IconQuestionMark />
          </ActionIcon>
        </Tooltip>
        <FormButtons okLabel="Import" discardLabel="" mt={0} />
      </Group>
    </form>
  );
}
