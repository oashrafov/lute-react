import { useMemo } from "react";
import { Group, Radio, rem, Text } from "@mantine/core";
import { IconCheck, IconMinus } from "@tabler/icons-react";
import classes from "./StatusRadio.module.css";

const radioIcon = (label, size, props) => (
  <Text
    {...props}
    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    lh={1}
    fw={500}
    fz={size}>
    {label}
  </Text>
);

const getRadios = (size) => [
  {
    value: "1",
    icon: (props) => radioIcon(1, size, props),
  },
  {
    value: "2",
    icon: (props) => radioIcon(2, size, props),
  },
  {
    value: "3",
    icon: (props) => radioIcon(3, size, props),
  },
  {
    value: "4",
    icon: (props) => radioIcon(4, size, props),
  },
  {
    value: "5",
    icon: (props) => radioIcon(5, size, props),
  },
  {
    value: "99",
    icon: (props) => radioIcon(<IconCheck />, size, props),
  },
  {
    value: "98",
    icon: (props) => radioIcon(<IconMinus />, size, props),
  },
];

function StatusRadio({
  form = null,
  disabled = false,
  size = "md",
  value = "0",
  onChange = null,
}) {
  const statusColor = (id) => `var(--lute-color-highlight-status${id})`;
  const iconColor = (id) => `var(--lute-text-color-status${id})`;
  const radios = useMemo(() => getRadios(size), [size]);
  return (
    <Radio.Group
      name="status"
      value={value}
      onChange={onChange}
      key={form?.key("status")}
      {...form?.getInputProps("status")}>
      <Group justify="flex-start" gap={2} wrap="nowrap">
        {radios.map((radio) => (
          <Radio
            key={radio.value}
            className={disabled ? classes.disabled : ""}
            style={{ "--radio-icon-size": rem(16) }}
            styles={{
              radio: {
                backgroundColor: statusColor(radio.value),
                border: "none",
              },
            }}
            size={size}
            disabled={disabled}
            value={disabled ? "" : radio.value}
            name={radio.value}
            iconColor={iconColor(radio.value)}
            color={statusColor(radio.value)}
            icon={radio.icon}
            ml={radio.value === radios[radios.length - 1].value ? 10 : 0}
          />
        ))}
      </Group>
    </Radio.Group>
  );
}

export default StatusRadio;
