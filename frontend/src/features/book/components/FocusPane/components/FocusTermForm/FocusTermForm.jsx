import { Affix, Paper, Transition } from "@mantine/core";
import TermForm from "@term/components/TermForm/TermForm";

function FocusTermForm({ term, language, onSetActiveTerm, show }) {
  return (
    term && (
      <Affix position={{ top: 100, right: 20 }} zIndex={199}>
        <Transition transition="slide-left" mounted={show}>
          {(styles) => (
            <div style={styles}>
              <Paper shadow="sm" p={10} w={300} withBorder>
                <TermForm
                  term={term}
                  language={language}
                  onSetActiveTerm={onSetActiveTerm}
                />
              </Paper>
            </div>
          )}
        </Transition>
      </Affix>
    )
  );
}

export default FocusTermForm;
