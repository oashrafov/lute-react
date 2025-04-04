import { memo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Tabs, Text, Tooltip } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import { IconPhoto } from "@tabler/icons-react";
import { getSentencesQuery } from "@term/api/query";
import { getLookupURL } from "@actions/utils";
import { MAX_VISIBLE_DICT_TABS } from "@resources/constants";
import Sentences from "@term/components/Sentences/Sentences";
import Iframe from "./components/common/Iframe";
import DictTabExternal from "./components/DictTabExternal";
import DictTabEmbedded from "./components/DictTabEmbedded";
import DictDropdown from "./components/DictDropdown";
import classes from "./DictTabs.module.css";

function DictTabs({
  termText,
  language,
  activeTab,
  onSetActiveTab,
  onReturnFocusToForm = () => {},
}) {
  const queryClient = useQueryClient();
  const [activeDropdownUrl, setActiveDropdownUrl] = useState("");
  const [tabValue, setTabValue] = useUncontrolled({
    value: activeTab,
    defaultValue: "0",
    onChange: onSetActiveTab,
  });

  function handleTabClick(tab) {
    setTabValue(tab);
    onReturnFocusToForm();
  }

  const termDicts = language.dictionaries.filter(
    (dict) => dict.for === "terms"
  );
  const visibleDicts = termDicts.slice(0, MAX_VISIBLE_DICT_TABS);
  const dropdownDicts = termDicts.slice(MAX_VISIBLE_DICT_TABS);
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

  const tabsStyle = {
    display: "grid",
    alignItems: "center",
    gridTemplateColumns: `repeat(${visibleDicts.length}, minmax(3rem, 8rem))`,
  };

  return (
    <Tabs
      dir="ltr"
      value={tabValue}
      classNames={{ root: classes.tabs }}
      styles={{
        tab: { paddingBlock: "xs" },
        tabLabel: { minWidth: 0 },
      }}>
      <Tabs.List className={`${classes.flex} ${classes.tabList}`}>
        <div style={tabsStyle}>
          {visibleDicts.map((dict, index) => (
            <Tooltip
              key={dict.label}
              label={dict.label}
              openDelay={150}
              refProp="innerRef">
              {dict.type === "popup" ? (
                <DictTabExternal
                  dict={dict}
                  termText={termText}
                  component={Button}
                />
              ) : (
                <DictTabEmbedded
                  dict={dict}
                  value={String(index)}
                  onClick={() => handleTabClick(String(index))}
                  component={Tabs.Tab}
                />
              )}
            </Tooltip>
          ))}
        </div>

        {dropdownDicts.length > 0 && (
          <DictDropdown
            termText={termText}
            dicts={dropdownDicts}
            onClick={(url) => {
              handleTabClick(tabs.dropdown);
              setActiveDropdownUrl(url);
            }}
          />
        )}

        <div style={{ display: "flex" }}>
          <Tabs.Tab
            className={classes.flex}
            value={tabs.sentences}
            onMouseEnter={() =>
              queryClient.prefetchQuery(
                getSentencesQuery(encodedTermText, language.id)
              )
            }
            onClick={() => handleTabClick(tabs.sentences)}>
            <Text size="sm" style={{ overflow: "hidden" }}>
              Sentences
            </Text>
          </Tabs.Tab>

          <Tabs.Tab
            className={classes.flex}
            styles={{ tabLabel: { minWidth: 0 } }}
            value={tabs.images}
            onClick={() => handleTabClick(tabs.images)}>
            <IconPhoto size={24} />
          </Tabs.Tab>
        </div>
      </Tabs.List>

      {visibleDicts.map((dict, index) => {
        return (
          dict.type === "embedded" && (
            <Tabs.Panel
              style={{ height: "100%" }}
              key={dict.label}
              value={String(index)}>
              <Iframe
                src={getLookupURL(dict.url, termText)}
                onHandleFocus={onReturnFocusToForm}
              />
            </Tabs.Panel>
          )
        );
      })}

      <Tabs.Panel h="100%" value={tabs.dropdown}>
        <Iframe
          src={getLookupURL(activeDropdownUrl, termText)}
          onHandleFocus={onReturnFocusToForm}
        />
      </Tabs.Panel>

      <Tabs.Panel
        style={{ overflowY: "auto", flexGrow: 1 }}
        value={tabs.sentences}>
        {tabValue === tabs.sentences && (
          <Sentences langId={language.id} termText={encodedTermText} />
        )}
      </Tabs.Panel>

      <Tabs.Panel h="100%" value={tabs.images}>
        IMAGES
      </Tabs.Panel>
    </Tabs>
  );
}

export default memo(DictTabs);
