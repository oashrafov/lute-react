import { useEffect } from "react";
import {
  Button,
  CloseButton,
  Fieldset,
  Group,
  Kbd,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { getPressedKeysAsString } from "../../misc/utils";

function ShortcutsForm({ data }) {
  const shortcuts = JSON.parse(data.shortcuts);
  const descriptions = JSON.parse(data.descriptions);

  console.log(descriptions);

  const form = useForm({
    mode: "uncontrolled",
    onValuesChange: () => {
      form.validate();
    },

    validate: (values) => {
      const validations = {};

      Object.entries(values).forEach(([field, value]) => {
        validations[field] = matches({ [field]: value }, values)
          ? "Hotkey already defined"
          : null;
      });

      return validations;
    },
    validateInputOnBlur: true, // needed because for some reason with keydown event (or because the input is readonly) clicking away after dupicate match removes error from the clicked field
  });

  // useEffect(() => {
  //   if (data) {
  //     const values = {};
  //     data.forEach((obj) => {
  //       Object.values(obj)[1].forEach((shortcut) => {
  //         values[shortcut.description] = shortcut.key;
  //       });
  //     });

  //     form.initialize(values);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);

  function handleKeyDown(e) {
    e.preventDefault();
    const eventAsString = getPressedKeysAsString(e);
    if (!eventAsString) return;

    // e.target.value = eventAsString;
    form.setFieldValue(e.target.name, eventAsString);
  }

  return (
    <>
      <form onSubmit={form.onSubmit(console.log())}>
        <Group align="flex-stretch" wrap="nowrap">
          {Object.entries(shortcuts).map(([category, keys]) => {
            return (
              <Fieldset
                // p="xs"
                w={300}
                key={category}
                fw={500}
                legend={category}>
                {Object.entries(keys).map(([id, shortcut]) => {
                  console.log(shortcut);
                  return (
                    <>
                      <Stack wrap="nowrap" gap={1} mb={3}>
                        <Text fz="xs" lineClamp={1}>
                          {descriptions[id]}
                        </Text>

                        <Kbd
                          variant="subtle"
                          component={Button}
                          w="100%"
                          styles={{
                            root: { height: "30px" },
                          }}>
                          {shortcut.split("+").join(" + ")}
                        </Kbd>
                        {/* </Button> */}
                      </Stack>
                      {/* // )} */}
                      {/* <Group key={shortcut.label} gap="0.5rem" align="flex-end">
                        <TextInput
                          {...form.getInputProps(shortcut.description)}
                          key={shortcut.description}
                          name={shortcut.description}
                          onKeyDown={handleKeyDown}
                          size="xs"
                          label={shortcut.label}
                          readOnly
                          rightSection={
                            <CloseButton
                              aria-label="Clear input"
                              onClick={() =>
                                form.setFieldValue(shortcut.description, "")
                              }
                              style={{
                                display: form.getValues()[shortcut.description]
                                  ? undefined
                                  : "none",
                              }}
                            />
                          }
                        />
                      </Group> */}
                    </>
                  );
                })}
              </Fieldset>
            );
          })}
        </Group>
        <Group justify="flex-end" mt="xl" gap="xs">
          <Button type="submit">Save</Button>
          <Button variant="subtle">Cancel</Button>
        </Group>
      </form>
    </>
  );
}

function matches(entry, entries) {
  const rest = { ...entries };
  delete rest[Object.keys(entry)[0]];

  return Object.values(rest).some(
    (value) => value !== "" && value === Object.values(entry)[0]
  );
}

export default ShortcutsForm;
