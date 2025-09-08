import { Menu } from "@mantine/core";
import { NavLink } from "react-router-dom";

interface MenuItem {
  label: string;
  action: string;
}

export function MenuItem({ item }: { item: MenuItem }) {
  return (
    <Menu.Item key={item.label} component={NavLink} to={item.action}>
      {item.label}
    </Menu.Item>
  );
}
