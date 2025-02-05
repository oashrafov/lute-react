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
  language,
  termText,
  activeTab,
  onSetActiveTab,
  translationFieldRef = {},
}) {
  const queryClient = useQueryClient();
  const [activeDropdownUrl, setActiveDropdownUrl] = useState("");
  const [tabValue, setTabValue] = useUncontrolled({
    value: activeTab,
    defaultValue: "0",
    onChange: onSetActiveTab,
  });

  const termDicts = language.dictionaries.filter(
    (dict) => dict.for === "terms"
  );
  const visibleDicts = termDicts.slice(0, MAX_VISIBLE_DICT_TABS);
  const dropdownDicts = termDicts.slice(MAX_VISIBLE_DICT_TABS);
  // %E2%80%8B is the zero-width string.  The term is reparsed
  // on the server, so this doesn't need to be sent.
  const encodedTermText = encodeURIComponent(termText).replaceAll(
    "%E2%80%8B",
    ""
  );

  function handleFocus() {
    setTimeout(() => {
      const input = translationFieldRef?.current;
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    }, 0);
  }

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
        <div
          style={{
            display: "grid",
            alignItems: "center",
            gridTemplateColumns: `repeat(${visibleDicts.length}, minmax(3rem, 8rem))`,
          }}>
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
                  onClick={() => {
                    setTabValue(String(index));
                    handleFocus();
                  }}
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
              setTabValue("dropdownTab");
              setActiveDropdownUrl(url);
              handleFocus();
            }}
          />
        )}

        <div style={{ display: "flex" }}>
          <Tabs.Tab
            className={classes.flex}
            id="sentencesTab"
            value="sentencesTab"
            onMouseEnter={() =>
              queryClient.prefetchQuery(
                getSentencesQuery(encodedTermText, language.id)
              )
            }
            onClick={() => {
              setTabValue("sentencesTab");
              handleFocus();
            }}>
            <Text size="sm" style={{ overflow: "hidden" }}>
              Sentences
            </Text>
          </Tabs.Tab>

          <Tabs.Tab
            className={classes.flex}
            styles={{ tabLabel: { minWidth: 0 } }}
            id="imagesTab"
            value="imagesTab"
            onClick={() => {
              setTabValue("imagesTab");
              handleFocus();
            }}>
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
              id={String(index)}
              value={String(index)}>
              <Iframe
                src={getLookupURL(dict.url, termText)}
                onHandleFocus={handleFocus}
              />
            </Tabs.Panel>
          )
        );
      })}

      <Tabs.Panel
        style={{ height: "100%" }}
        key="dropdownTab"
        id="dropdownTab"
        value="dropdownTab">
        <Iframe
          src={getLookupURL(activeDropdownUrl, termText)}
          onHandleFocus={handleFocus}
        />
      </Tabs.Panel>

      <Tabs.Panel
        style={{ overflowY: "auto", flexGrow: 1 }}
        id="sentencesTab"
        value="sentencesTab"
        key="sentencesTab">
        {tabValue === "sentencesTab" && (
          <Sentences langId={language.id} termText={encodedTermText} />
        )}
      </Tabs.Panel>

      <Tabs.Panel
        style={{ height: "100%" }}
        id="imagesTab"
        value="imagesTab"
        key="imagesTab">
        IMAGES
      </Tabs.Panel>
    </Tabs>
  );
}

export default memo(DictTabs);
