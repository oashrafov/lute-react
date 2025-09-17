import { Tooltip } from "@mantine/core";
import type { Control, FieldValues, Path } from "react-hook-form";
import { TextInput } from "../../../../../../components/common/TextInput/TextInput";
import { Checkbox } from "../../../../../../components/common/Checkbox/Checkbox";
import { Select } from "../../../../../../components/common/Select/Select";
import { TestDictionaryButton } from "./components/TestDictionaryButton";
import type { Dictionary } from "../../../../api/types";

export interface DictionaryBar<T extends FieldValues> {
  control: Control<T>;
  dict: Dictionary;
  name: string;
  editable: boolean;
}

export function DictionaryBar<T extends FieldValues>({
  name,
  dict,
  control,
  editable,
}: DictionaryBar<T>) {
  return (
    <>
      <Tooltip label="Is active?" openDelay={300} withinPortal={false}>
        <Checkbox
          name={`${name}.active` as Path<T>}
          control={control}
          size="xs"
          disabled={!editable}
        />
      </Tooltip>

      <TextInput
        name={`${name}.url` as Path<T>}
        control={control}
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
      />

      <Tooltip label="Use for" openDelay={300} withinPortal={false}>
        <Select
          name={`${name}.for` as Path<T>}
          control={control}
          aria-label="Use dictionary for"
          size="xs"
          data={[
            { label: "Terms", value: "terms" },
            { label: "Sentences", value: "sentences" },
          ]}
        />
      </Tooltip>

      <Tooltip label="Show as" openDelay={300} withinPortal={false}>
        <Select
          name={`${name}.type` as Path<T>}
          control={control}
          aria-label="Show dictionary as"
          size="xs"
          data={[
            { label: "Embedded", value: "embedded" },
            { label: "Pop-up", value: "popup" },
          ]}
        />
      </Tooltip>
    </>
  );
}
