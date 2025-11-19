import { Fragment } from "react/jsx-runtime";
import { ActionIcon, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { DictTabExternal } from "./DictTabExternal";
import { DictTabEmbedded } from "./DictTabEmbedded";
import type { Dictionary } from "../../../api/types";

interface DictsMenu {
  termText: string;
  dicts: Dictionary[];
  onClick: (url: string) => void;
}

export function DictsMenu({ termText, dicts, onClick }: DictsMenu) {
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
        {dicts.map((dict) => (
          <Fragment key={dict.label}>
            {dict.type === "popup" ? (
              <DictTabExternal
                dict={dict}
                termText={termText}
                component={Menu.Item}
              />
            ) : (
              <DictTabEmbedded
                dict={dict}
                value={String("dropdownTab")}
                onClick={() => onClick(dict.url)}
                component={Menu.Item}
              />
            )}
          </Fragment>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
