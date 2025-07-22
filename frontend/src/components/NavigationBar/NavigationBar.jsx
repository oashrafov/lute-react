import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { Menu, Group, Divider } from "@mantine/core";
import { modals } from "@mantine/modals";
import { softwareInfo } from "@resources/modals";
import { menu } from "@resources/menus";
import { settingsQuery } from "@settings/api/settings";
import { DropdownMenu } from "./components/DropdownMenu";
import classes from "./NavigationBar.module.css";

export function NavigationBar({ ...props }) {
  const { data: settings } = useQuery(settingsQuery);
  const createBackupMenu =
    settings.backup.enabled && settings.backup.directory != "";

  return (
    <Group component="nav" gap={5} wrap="nowrap" ml="auto" {...props}>
      {[menu.home, menu.book, menu.languages].map((menu) => (
        <NavLink key={menu.label} to={menu.action} className={classes.link}>
          {menu.label}
        </NavLink>
      ))}

      <DropdownMenu label={menu.terms.label}>
        {menu.terms.children.map((child) => makeLink(child))}
      </DropdownMenu>

      <DropdownMenu label={menu.settings.label}>
        {menu.settings.children.map((child) => makeLink(child))}
      </DropdownMenu>

      {createBackupMenu && (
        <DropdownMenu label={menu.backup.label}>
          {settings.backup.lastDate && (
            <>
              <div className={classes.backup}>
                {settings.backup.timeSince && (
                  <p>{`Last backup was ${settings.backup.timeSince}`}</p>
                )}
                <p>{settings.backup.lastDate}</p>
              </div>
              <Menu.Label>
                <Divider />
              </Menu.Label>
            </>
          )}
          {menu.backup.children.map((child) => makeLink(child))}
        </DropdownMenu>
      )}

      <DropdownMenu label={menu.about.label}>
        <Menu.Item onClick={() => modals.openContextModal(softwareInfo)}>
          {menu.about.info.label}
        </Menu.Item>
        <Menu.Item component={NavLink} to={menu.about.stats.action}>
          {menu.about.stats.label}
        </Menu.Item>
        <Menu.Item component="a" href={menu.about.docs.action} target="_blank">
          {menu.about.docs.label}
        </Menu.Item>
        <Menu.Item
          component="a"
          href={menu.about.discord.action}
          target="_blank">
          {menu.about.discord.label}
        </Menu.Item>
      </DropdownMenu>
    </Group>
  );
}

const makeLink = (child) => (
  <Menu.Item key={child.label} component={NavLink} to={child.action}>
    {child.label}
  </Menu.Item>
);
