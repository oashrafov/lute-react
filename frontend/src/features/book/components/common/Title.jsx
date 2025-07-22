import { Text } from "@mantine/core";

export function Title({ title, component }) {
  return (
    <Text component={component} fw="normal" fz="inherit" lineClamp={1}>
      {title}
    </Text>
  );
}
