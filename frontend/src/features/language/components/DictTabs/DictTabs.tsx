import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Box, Button, Tabs, Text, Tooltip } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import { IconPhoto } from "@tabler/icons-react";
import { MAX_VISIBLE_DICT_TABS } from "../../../../resources/constants";
import { Sentences } from "../../../term/components/Sentences/Sentences";
import { IFrame } from "./components/common/IFrame";
import { DictTabExternal } from "./components/DictTabExternal";
import { DictTabEmbedded } from "./components/DictTabEmbedded";
import { DictDropdown } from "./components/DictDropdown";
import { VisibleTabsContainer } from "./components/VisibleTabsContainer";
import { useActiveDictTabContext } from "../../hooks/useActiveDictTabContext";
import { queries as termQueries } from "../../../term/api/queries";
import type { Dictionary, UserLanguageDetail } from "../../api/types";
import { getLookupURL } from "../../../../helpers/language";
import classes from "./DictTabs.module.css";

interface DictTabs {
  termText: string;
  language: UserLanguageDetail;
  onReturnFocusToForm?: () => void;
}

interface Dict {
  dict: Dictionary;
  tabValue: string;
}

export function DictTabs({
  termText,
  language,
  onReturnFocusToForm,
}: DictTabs) {
  const { activeDictTab, setActiveDictTab } = useActiveDictTabContext();
  const [activeDropdownUrl, setActiveDropdownUrl] = useState("");
  const [tabValue, setTabValue] = useUncontrolled({
    value: activeDictTab,
    defaultValue: "0",
    onChange: setActiveDictTab,
  });

  function handleTabClick(tab: string) {
    setTabValue(tab);
    onReturnFocusToForm?.();
  }

  const termDicts = language.dictionaries.filter(
    (dict) => dict.for === "terms"
  );
  const visibleDicts = termDicts.slice(0, MAX_VISIBLE_DICT_TABS);
  const dropdownDicts = termDicts.slice(MAX_VISIBLE_DICT_TABS);
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

  function DictTab({ dict, tabValue }: Dict) {
    return (
      <Tooltip label={dict.label} openDelay={150} refProp="innerRef">
        {dict.type === "popup" ? (
          <DictTabExternal dict={dict} termText={termText} component={Button} />
        ) : (
          <DictTabEmbedded
            dict={dict}
            value={tabValue}
            onClick={() => handleTabClick(tabValue)}
            component={Tabs.Tab}
          />
        )}
      </Tooltip>
    );
  }

  function DictsDropdown() {
    return (
      <DictDropdown
        termText={termText}
        dicts={dropdownDicts}
        onClick={(url: string) => {
          handleTabClick(tabs.dropdown);
          setActiveDropdownUrl(url);
        }}
      />
    );
  }

  function SentencesTab() {
    const queryClient = useQueryClient();

    function prefetchSentences() {
      queryClient.prefetchQuery(
        termQueries.sentences(encodedTermText, language.id)
      );
    }

    return (
      <Tabs.Tab
        className={classes.flex}
        value={tabs.sentences}
        onMouseEnter={prefetchSentences}
        onClick={() => handleTabClick(tabs.sentences)}>
        <Text size="sm" style={{ overflow: "hidden" }}>
          Sentences
        </Text>
      </Tabs.Tab>
    );
  }

  function ImagesTab() {
    return (
      <Tabs.Tab
        className={classes.flex}
        styles={{ tabLabel: { minWidth: 0 } }}
        value={tabs.images}
        onClick={() => handleTabClick(tabs.images)}>
        <IconPhoto size={24} />
      </Tabs.Tab>
    );
  }

  function DictTabPanel({ dict, tabValue }: Dict) {
    return (
      <Tabs.Panel h="100%" value={tabValue}>
        <IFrame
          src={getLookupURL(dict.url, termText)}
          onLoad={onReturnFocusToForm}
        />
      </Tabs.Panel>
    );
  }

  function DropdownDictPanel() {
    return (
      <Tabs.Panel h="100%" value={tabs.dropdown}>
        <IFrame
          src={getLookupURL(activeDropdownUrl, termText)}
          onLoad={onReturnFocusToForm}
        />
      </Tabs.Panel>
    );
  }

  function SentencesPanel() {
    return (
      <Tabs.Panel
        style={{ overflowY: "auto", flexGrow: 1 }}
        value={tabs.sentences}>
        {tabValue === tabs.sentences && (
          <Sentences langId={language.id} termText={encodedTermText} />
        )}
      </Tabs.Panel>
    );
  }

  function ImagesPanel() {
    return (
      <Tabs.Panel h="100%" value={tabs.images}>
        IMAGES
      </Tabs.Panel>
    );
  }

  function StyledTabs({ children }: { children: ReactNode }) {
    return (
      <Tabs
        dir="ltr"
        value={tabValue}
        classNames={{ root: classes.tabs }}
        styles={{
          tab: { paddingBlock: "xs" },
          tabLabel: { minWidth: 0 },
        }}>
        {children}
      </Tabs>
    );
  }

  return (
    <StyledTabs>
      <Tabs.List className={`${classes.flex} ${classes.tabList}`}>
        <VisibleTabsContainer>
          {visibleDicts.map((dict, index) => (
            <DictTab key={dict.label} dict={dict} tabValue={String(index)} />
          ))}
        </VisibleTabsContainer>

        {dropdownDicts.length > 0 && <DictsDropdown />}

        <Box display="flex">
          <SentencesTab />
          <ImagesTab />
        </Box>
      </Tabs.List>

      {embeddedVisibleDicts.map((dict, index) => (
        <DictTabPanel key={dict.label} dict={dict} tabValue={String(index)} />
      ))}
      <DropdownDictPanel />
      <SentencesPanel />
      <ImagesPanel />
    </StyledTabs>
  );
}
