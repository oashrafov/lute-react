import { memo } from "react";
import {
  ActionIcon,
  Checkbox,
  Group,
  NativeSelect,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconGripVertical,
  IconSquareRoundedMinusFilled,
} from "@tabler/icons-react";
import TestDictionaryButton from "./components/TestDictionaryButton";

function DictionaryBar({ form, index, dndProvided }) {
  const testUrl = form
    .getValues()
    .dictionaries[index]?.url.replace("###", "test")
    .replace("[LUTE]", "test");

  return (
    <Group
      mb={5}
      gap="xs"
      wrap="nowrap"
      justify="space-between"
      ref={dndProvided.innerRef}
      {...dndProvided.draggableProps}>
      <ActionIcon
        variant="transparent"
        c="dark"
        {...dndProvided.dragHandleProps}>
        <IconGripVertical />
      </ActionIcon>

      <Tooltip label="Is active?" openDelay={300} withinPortal={false}>
        <Checkbox
          size="xs"
          disabled={form.getValues().dictionaries.length <= 2}
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
          form.getValues().dictionaries[index]?.url.length > 0 ? (
            <TestDictionaryButton src={testUrl} />
          ) : null
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
          disabled={form.getValues().dictionaries.length > 2 ? false : true}
          variant="transparent"
          color="red.6"
          size="sm"
          style={{ backgroundColor: "transparent" }}
          onClick={() =>
            form.getValues().dictionaries.length > 2 &&
            form.removeListItem("dictionaries", index)
          }>
          <IconSquareRoundedMinusFilled />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

export default memo(DictionaryBar);
