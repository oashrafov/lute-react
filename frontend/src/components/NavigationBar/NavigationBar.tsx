import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Menu, Group, Divider } from "@mantine/core";
import { modals } from "@mantine/modals";
import { appInfo } from "../../resources/modals";
import { menu } from "../../resources/menus";
import { DropdownMenu } from "./components/DropdownMenu";
import { MenuItem } from "./components/MenuItem";
import { queries } from "../../features/settings/api/queries";
import classes from "./NavigationBar.module.css";

export function NavigationBar({ ...props }) {
  const { data: settings } = useSuspenseQuery(queries.settingsForm());
  const createBackupMenu = settings.backup_enabled && settings.backup_dir != "";

  return (
    <Group component="nav" gap={5} wrap="nowrap" ml="auto" {...props}>
      {[menu.home, menu.book, menu.languages].map((menu) => (
        <Link key={menu.label} to={menu.action} className={classes.link}>
          {menu.label}
        </Link>
      ))}

      <DropdownMenu label={menu.terms.label}>
        {menu.terms.children.map((child) => (
          <MenuItem key={child.label} item={child} />
        ))}
      </DropdownMenu>

      <DropdownMenu label={menu.settings.label}>
        {menu.settings.children.map((child) => (
          <MenuItem key={child.label} item={child} />
        ))}
      </DropdownMenu>

      {createBackupMenu && (
        <DropdownMenu label={menu.backup.label}>
          {settings?.last_backup_display_date && (
            <>
              <div className={classes.backup}>
                {settings.time_since_last_backup && (
                  <p>{`Last backup was ${settings.time_since_last_backup}`}</p>
                )}
                <p>{settings.last_backup_display_date}</p>
              </div>
              <Menu.Label>
                <Divider />
              </Menu.Label>
            </>
          )}
          <MenuItem
            key={menu.backup.children[0].label}
            item={menu.backup.children[0]}
          />
          <Menu.Item
            component="a"
            href={menu.backup.children[1].action}
            target="_blank">
            {menu.backup.children[1].label}
          </Menu.Item>
        </DropdownMenu>
      )}

      <DropdownMenu label={menu.about.label}>
        <Menu.Item onClick={() => modals.openContextModal(appInfo)}>
          {menu.info.label}
        </Menu.Item>
        <Menu.Item
          renderRoot={(props) => <Link to={menu.stats.action} {...props} />}>
          {menu.stats.label}
        </Menu.Item>
        <Menu.Item component="a" href={menu.docs.action} target="_blank">
          {menu.docs.label}
        </Menu.Item>
        <Menu.Item component="a" href={menu.discord.action} target="_blank">
          {menu.discord.label}
        </Menu.Item>
      </DropdownMenu>
    </Group>
  );
}
