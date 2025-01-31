import { Affix, Paper, Transition } from "@mantine/core";
import TermForm from "@term/components/TermForm/TermForm";

function FloatingTermForm({ term, language, onSetActiveTerm, show }) {
  return (
    <Affix position={{ top: 100, right: 20 }} zIndex={199}>
      <Transition transition="slide-left" mounted={show}>
        {(styles) => (
          <Paper shadow="md" p={10} style={styles} w={300} withBorder>
            <TermForm
              key={term.text}
              term={term}
              language={language}
              onSetActiveTerm={onSetActiveTerm}
            />
          </Paper>
        )}
      </Transition>
    </Affix>
  );
}

export default FloatingTermForm;
