import {
  ActionIcon,
  Checkbox,
  NativeSelect,
  TextInput,
  Tooltip,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconSquareRoundedMinusFilled } from "@tabler/icons-react";
import { TestDictionaryButton } from "./components/TestDictionaryButton";
import type { Dictionary, LanguageForm } from "../../../../api/types";

export interface DictionaryBar {
  dict: Dictionary;
  form: UseFormReturnType<LanguageForm>;
  index: number;
  editable: boolean;
  onRemove: () => void;
}

export function DictionaryBar({
  form,
  index,
  dict,
  editable,
  onRemove,
}: DictionaryBar) {
  return (
    <>
      <Tooltip label="Is active?" openDelay={300} withinPortal={false}>
        <Checkbox
          size="xs"
          disabled={!editable}
          key={form.key(`dictionaries.${index}.active`)}
          {...form.getInputProps(`dictionaries.${index}.active`, {
            type: "checkbox",
          })}
        />
      </Tooltip>

      <TextInput
        flex={5}
        size="xs"
        placeholder="Dictionary URL"
        rightSection={
          dict.url.length > 0 && (
            <TestDictionaryButton
              src={dict.url.replace("###", "test").replace("[LUTE]", "test")}
            />
          )
        }
        key={form.key(`dictionaries.${index}.url`)}
        {...form.getInputProps(`dictionaries.${index}.url`)}
      />

      <Tooltip label="Use for" openDelay={300} withinPortal={false}>
        <NativeSelect
          aria-label="Use dictionary for"
          size="xs"
          data={[
            { label: "Terms", value: "terms" },
            { label: "Sentences", value: "sentences" },
          ]}
          key={form.key(`dictionaries.${index}.for`)}
          {...form.getInputProps(`dictionaries.${index}.for`)}
        />
      </Tooltip>

      <Tooltip label="Show as" openDelay={300} withinPortal={false}>
        <NativeSelect
          aria-label="Show dictionary as"
          size="xs"
          data={[
            { label: "Embedded", value: "embedded" },
            { label: "Pop-up", value: "popup" },
          ]}
          key={form.key(`dictionaries.${index}.type`)}
          {...form.getInputProps(`dictionaries.${index}.type`)}
        />
      </Tooltip>

      <Tooltip label="Remove dictionary" openDelay={300} withinPortal={false}>
        <ActionIcon
          disabled={!editable}
          variant="transparent"
          color="red.6"
          size="sm"
          style={{ backgroundColor: "transparent" }}
          onClick={onRemove}>
          <IconSquareRoundedMinusFilled />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
