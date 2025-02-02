import { ActionIcon, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import DictTabExternal from "./DictTabExternal";
import DictTabEmbedded from "./DictTabEmbedded";

function DictDropdown({ termText, dicts, onClick }) {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon
          variant="transparent"
          mr="auto"
          ml="xs"
          style={{ alignSelf: "center" }}>
          <IconChevronDown />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {dicts.map((dict) =>
          dict.isExternal ? (
            <DictTabExternal
              key={dict.label}
              dict={dict}
              termText={termText}
              component={Menu.Item}
            />
          ) : (
            <DictTabEmbedded
              key={dict.label}
              dict={dict}
              value={String("dropdownTab")}
              onClick={() => onClick(dict.url)}
              component={Menu.Item}
            />
          )
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

export default DictDropdown;
