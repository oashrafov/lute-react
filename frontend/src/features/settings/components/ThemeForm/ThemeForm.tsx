import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, type UseFormReturnType } from "@mantine/form";
import {
  Box,
  CloseButton,
  ColorInput,
  Divider,
  Group,
  NativeSelect,
  Select,
  Stack,
  Table,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { FormButtons } from "../../../../components/common/FormButtons/FormButtons";
import {
  clearAllFlashing,
  getMatchedTextItems,
  makeFlashing,
} from "../../../../helpers/text";
import { setTextColor } from "../../../../helpers/general";
import { useBookContext } from "../../../book/hooks/useBookContext";
import { queries } from "../../api/queries";
import { TEXTITEM_DATA } from "../../../../resources/constants";
import type {
  HighlightType,
  TextItemElement,
} from "../../../../resources/types";
import type {
  GeneralHighlights,
  SettingsResponse,
  StatusHighlights,
} from "../../api/types";

const label = {
  status: {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    98: "Ignored",
    99: "Well known",
  },
  general: {
    kwordmarked: "Selected",
    wordhover: "Hovered",
    multiterm: "Multi selection",
    flash: "Flashing highlight",
  },
} as const;

function getLuteHighlights(
  labels: typeof label.status | typeof label.general,
  colors: GeneralHighlights | StatusHighlights,
  scheme: "light" | "dark"
) {
  type T = typeof labels;
  const keys = Object.keys(labels) as Array<T>;
  return keys.map((key) => ({
    id: key,
    color: colors[key][scheme],
    type: colors[key].type,
    label: labels[key],
    isActive: colors[key].type === "none",
  }));
}

function getRootElement() {
  return document.querySelector(
    `:root[data-mantine-color-scheme]`
  ) as HTMLElement;
}

interface ThemeFormValues {
  highlights: {
    statuses: {
      id: string;
      color: any;
      type: any;
      label: any;
      isActive: boolean;
    }[];
    allType: {
      allType: string;
    };
    general: {
      id: string;
      color: any;
      type: any;
      label: any;
      isActive: boolean;
    }[];
  };
  primaryColor: string;
  backgroundColor: string;
}

function ThemeForm() {
  const { themeForm } = useBookContext();
  const { colorScheme } = useMantineColorScheme();
  const { data: settings } = useQuery(queries.settings());
  const root = getRootElement();

  const form = useForm({
    mode: "controlled",
    name: "settingsForm",
    initialValues: {
      highlights: {
        statuses: [
          ...getLuteHighlights(
            label.status,
            settings.highlights.status,
            colorScheme
          ),
        ],
        allType: { allType: "-" },
        general: [
          ...getLuteHighlights(
            label.general,
            settings.highlights.general,
            colorScheme
          ),
        ],
      },
      primaryColor: "#fff",
      backgroundColor: "#000",
    },
  });

  const {
    handleStatusHighlightChange,
    handleStatusHighlightChangeEnd,
    handleTypeChange,
    handleAllTypeChange,
    handleGeneralHighlightChange,
    handleGeneralHighlightChangeEnd,
  } = useThemeForm(form, root, settings, colorScheme);

  return (
    <Stack gap={0} style={{ flexWrap: "nowrap" }}>
      <Group justify="space-between">
        <Text component="h2" fw={600}>
          Theme Customizer
        </Text>
        <CloseButton onClick={themeForm.close} />
      </Group>
      <form>
        <Box>
          <Select
            size="xs"
            label="Presets"
            withCheckIcon={false}
            allowDeselect={false}
            defaultValue="default"
            data={["default", "LWT", "LinQ"]}
          />
          <Group wrap="nowrap" mb={10}>
            <NativeSelect
              size="xs"
              flex={1}
              label="Text font"
              data={[
                { label: "Arial", value: "arial" },
                { label: "Roboto", value: "roboto" },
                { label: "Montserrat", value: "montserrat" },
              ]}
            />
            <ColorInput
              size="xs"
              flex={1}
              label="Body color"
              popoverProps={{ position: "bottom" }}
              styles={{
                root: { minWidth: "200px", width: "min-content" },
              }}
              fixOnBlur
              {...form.getInputProps("backgroundColor")}
              key={form.key("backgroundColor")}
              onChangeEnd={(color) =>
                form.setFieldValue("backgroundColor", color)
              }
              onChange={(color) =>
                root.style.setProperty("--lute-color-read", color)
              }
            />
            <ColorInput
              size="xs"
              flex={1}
              label="Primary scheme color"
              popoverProps={{ position: "bottom" }}
              styles={{
                root: { minWidth: "200px", width: "min-content" },
              }}
              fixOnBlur
              {...form.getInputProps("primaryColor")}
              key={form.key("primaryColor")}
            />
          </Group>
          <Divider label="Status Highlights" mb={10} />
          <Stack gap={10}>
            <Table
              withTableBorder
              verticalSpacing={5}
              horizontalSpacing={30}
              striped
              highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th fw={500}>Name</Table.Th>
                  <Table.Th fw={500}>Color</Table.Th>
                  <Table.Th fw={500}>Highlight</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {form
                  .getValues()
                  .highlights.statuses.map((highlight, index) => (
                    <Table.Tr key={highlight.label}>
                      <Table.Td style={{ minWidth: "170px", paddingRight: 0 }}>
                        {highlight.label}
                      </Table.Td>
                      <Table.Td>
                        <ColorInput
                          {...form.getInputProps(
                            `highlights.statuses.${index}.color`
                          )}
                          key={form.key(`highlights.statuses.${index}.color`)}
                          onChange={(color) =>
                            handleStatusHighlightChange(highlight, color)
                          }
                          onChangeEnd={(color) =>
                            handleStatusHighlightChangeEnd(color, index)
                          }
                          format="hex"
                          popoverProps={{ position: "bottom" }}
                          fixOnBlur
                          size="xs"
                        />
                      </Table.Td>
                      <Table.Td>
                        <NativeSelect
                          size="xs"
                          data={[
                            { label: "Background", value: "bg" },
                            { label: "Text", value: "text" },
                            { label: "Underline: solid", value: "solid" },
                            { label: "Underline: dashed", value: "dashed" },
                            { label: "None", value: "none" },
                          ]}
                          {...form.getInputProps(
                            `highlights.statuses.${index}.type`
                          )}
                          key={form.key(`highlights.statuses.${index}.type`)}
                          onChange={(e) => {
                            handleTypeChange(e, index, highlight);
                          }}
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                <Table.Tr>
                  <Table.Td>All</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td>
                    <NativeSelect
                      size="xs"
                      data={[
                        { label: "-", value: "-" },
                        { label: "Background", value: "bg" },
                        { label: "Text", value: "text" },
                        { label: "Underline: solid", value: "solid" },
                        { label: "Underline: dashed", value: "dashed" },
                      ]}
                      {...form.getInputProps("highlights.allType")}
                      onChange={(e) => {
                        handleAllTypeChange(
                          e.currentTarget.value as HighlightType
                        );
                      }}
                    />
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>

            <Divider label="General Text Highlights" />

            <Table
              withTableBorder
              verticalSpacing={5}
              horizontalSpacing={30}
              striped
              highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th fw={500}>Name</Table.Th>
                  <Table.Th fw={500}>Color</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {form.getValues().highlights.general.map((highlight, index) => (
                  <Table.Tr key={highlight.label}>
                    <Table.Td style={{ minWidth: "170px", paddingRight: 0 }}>
                      {highlight.label}
                    </Table.Td>
                    <Table.Td>
                      <ColorInput
                        size="xs"
                        {...form.getInputProps(
                          `highlights.general.${index}.color`
                        )}
                        key={`highlights.general.${index}.color`}
                        onChange={(color) =>
                          handleGeneralHighlightChange(highlight.id, color)
                        }
                        onChangeEnd={(color) =>
                          handleGeneralHighlightChangeEnd(
                            highlight.id,
                            color,
                            index
                          )
                        }
                        format="hex"
                        popoverProps={{ position: "bottom" }}
                        fixOnBlur
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </Box>

        <FormButtons />
      </form>
    </Stack>
  );
}

function useThemeForm(
  form: UseFormReturnType<ThemeFormValues>,
  root: HTMLElement,
  settings: SettingsResponse,
  colorScheme: "dark" | "light"
) {
  function handleStatusHighlightChange(highlight, color) {
    root.style.setProperty(`--lute-color-highlight-${highlight.id}`, color);
    setTextColor(highlight.id, color, root);
  }

  function handleStatusHighlightChangeEnd(color, index) {
    form.setFieldValue(`highlights.statuses.${index}.color`, color);
  }

  function handleTypeChange(e, index, highlight) {
    const val = e.currentTarget.value;
    const textitems = document.querySelectorAll(`.${highlight.id}`);
    textitems.forEach((textitem) => (textitem.dataset.highlightType = val));

    setTextColor(highlight.id, highlight.color, root);

    form.setFieldValue(`highlights.statuses.${index}.type`, val);
    form.setFieldValue("highlights.allType", "-");
  }

  function handleAllTypeChange(type: HighlightType) {
    const textitems = document.querySelectorAll<TextItemElement>(
      form
        .getValues()
        .highlights.statuses.map((highlight) => `.${highlight.id}`)
        .join(",")
    );
    textitems.forEach((textitem) => (textitem.dataset.highlightType = type));

    form
      .getValues()
      .highlights.statuses.forEach((highlight, index) =>
        form.setFieldValue(`highlights.statuses.${index}.type`, type)
      );
  }

  function handleGeneralHighlightChange(id, color) {
    root.style.setProperty(`--lute-color-highlight-${id}`, color);
    setTextColor(id, color, root);
  }

  function handleGeneralHighlightChangeEnd(id, color, index) {
    form.setFieldValue(`highlights.general.${index}.color`, color);
    setTextColor(id, color, root);

    if (id === "flash") {
      const textitem = document.querySelector<TextItemElement>(
        `[data-${TEXTITEM_DATA.sentenceId}="0"]`
      )!;
      const matched = getMatchedTextItems(textitem, "sentence");
      makeFlashing(matched);
      clearAllFlashing();
    }
  }

  useEffect(() => {
    form.setFieldValue("highlights.statuses", [
      ...getLuteHighlights(
        label.status,
        settings.highlights.status,
        colorScheme
      ),
    ]);
    form.setFieldValue("highlights.general", [
      ...getLuteHighlights(
        label.general,
        settings.highlights.general,
        colorScheme
      ),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorScheme]);

  return {
    handleStatusHighlightChange,
    handleStatusHighlightChangeEnd,
    handleTypeChange,
    handleAllTypeChange,
    handleGeneralHighlightChange,
    handleGeneralHighlightChangeEnd,
  };
}

export default ThemeForm;
