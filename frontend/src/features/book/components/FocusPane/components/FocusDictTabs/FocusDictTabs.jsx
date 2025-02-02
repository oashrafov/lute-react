import { Affix, Paper, Transition } from "@mantine/core";
import DictTabs from "@language/components/DictTabs/DictTabs";

function FocusDictTabs({
  termText,
  language,
  activeTab,
  onSetActiveTab,
  show,
}) {
  return (
    <Affix position={{ bottom: 20, left: 20 }} zIndex={199}>
      <Transition transition="slide-right" mounted={show}>
        {(styles) => (
          <div style={styles}>
            <Paper shadow="sm" p={10} w={800} withBorder h={500}>
              {termText && (
                <DictTabs
                  language={language}
                  termText={termText}
                  activeTab={activeTab}
                  onSetActiveTab={onSetActiveTab}
                />
              )}
            </Paper>
          </div>
        )}
      </Transition>
    </Affix>
  );
}

export default FocusDictTabs;
