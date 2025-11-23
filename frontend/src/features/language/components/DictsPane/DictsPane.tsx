import { useState } from "react";
import { Box, Tabs, Text } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { MAX_VISIBLE_DICT_TABS } from "#resources/constants";
import { getLookupURL } from "#helpers/language";
import { Sentences } from "#term/components/Sentences/Sentences";
import { DictsMenu } from "./components/DictsMenu";
import { VisibleDictsContainer } from "./components/VisibleDictsContainer";
import { DictsTabs } from "./components/DictsTabs";
import { IFramePanel } from "./components/IFramePanel";
import { TabPanel } from "./components/common/TabPanel";
import { DictTab } from "./components/DictTab";
import { Tab } from "./components/Tab";
import type { Dictionary } from "#language/api/types";
import classes from "./DictsPane.module.css";

interface DictsPane {
  termText: string;
  dictionaries: Dictionary[];
  onReturnFocusToForm?: () => void;
}

export function DictsPane({
  termText,
  dictionaries,
  onReturnFocusToForm,
}: DictsPane) {
  const [activeDropdownUrl, setActiveDropdownUrl] = useState("");
  const visibleDicts = dictionaries.slice(0, MAX_VISIBLE_DICT_TABS);
  const dropdownDicts = dictionaries.slice(MAX_VISIBLE_DICT_TABS);
  const embeddedVisibleDicts = visibleDicts.filter(
    (dict) => dict.type === "embedded"
  );
  // %E2%80%8B is the zero-width string. The term is reparsed
  // on the server, so this doesn't need to be sent.
  const encodedTermText = encodeURIComponent(termText).replaceAll(
    "%E2%80%8B",
    ""
  );

  const tabs = {
    dropdown: "dropdownTab",
    sentences: "sentencesTab",
    images: "imagesTab",
  };

  return (
    <DictsTabs defaultValue={String(visibleDicts[0].id)}>
      <Tabs.List className={`${classes.flex} ${classes.tabList}`}>
        <VisibleDictsContainer>
          {visibleDicts.map((dict) => (
            <DictTab
              key={dict.label}
              dict={dict}
              value={String(dict.id)}
              termText={termText}
            />
          ))}
        </VisibleDictsContainer>

        {dropdownDicts.length > 0 && (
          <DictsMenu
            termText={termText}
            dicts={dropdownDicts}
            onClick={setActiveDropdownUrl}
            tabValue={tabs.dropdown}
          />
        )}

        <Box display="flex">
          <Tab value={tabs.sentences}>
            <Text size="sm" style={{ overflow: "hidden" }}>
              Sentences
            </Text>
          </Tab>

          <Tab value={tabs.images} leftSection={<IconPhoto />} />
        </Box>
      </Tabs.List>

      {embeddedVisibleDicts.map((dict) => (
        <IFramePanel
          key={dict.label}
          frameSrc={getLookupURL(dict.url, termText)}
          value={String(dict.id)}
          onFrameLoad={onReturnFocusToForm} // !fix: calling this causes loss of dict scroll position
        />
      ))}

      <IFramePanel
        frameSrc={getLookupURL(activeDropdownUrl, termText)}
        onFrameLoad={onReturnFocusToForm}
        value={tabs.dropdown}
      />

      <TabPanel
        value={tabs.sentences}
        style={{ overflowY: "auto", flexGrow: 1 }}>
        <Sentences termText={encodedTermText} />
      </TabPanel>

      <IFramePanel frameSrc="" value={tabs.images} />
    </DictsTabs>
  );
}
