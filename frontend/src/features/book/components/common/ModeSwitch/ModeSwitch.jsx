import { Tooltip, Switch } from "@mantine/core";

export function ModeSwitch({ checked, onChange, icon: Icon, label }) {
  return (
    <Tooltip label={label} position="left" openDelay={800} refProp="rootRef">
      <Switch
        checked={checked}
        onChange={onChange}
        size="sm"
        onLabel="ON"
        offLabel="OFF"
        thumbIcon={<Icon size={12} color="teal" stroke={2} />}
      />
    </Tooltip>
  );
}
