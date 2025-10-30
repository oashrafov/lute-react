import { Link } from "@tanstack/react-router";
import { Menu } from "@mantine/core";

interface MenuItem {
  label: string;
  action: string;
}

export function MenuItem({ item }: { item: MenuItem }) {
  return (
    <Menu.Item
      key={item.label}
      renderRoot={(props) => <Link to={item.action} {...props} />}>
      {item.label}
    </Menu.Item>
  );
}
