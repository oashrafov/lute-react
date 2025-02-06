import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";

function useLanguageForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      character_substitutions: "´='|`='|’='|‘='|...=…|..=‥",
      split_sentences: ".!?",
      split_sentence_exceptions: "Mr.|Mrs.|Dr.|[A-Z].|Vd.|Vds.",
      word_chars: "a-zA-ZÀ-ÖØ-öø-ȳáéíóúÁÉÍÓÚñÑ",
      right_to_left: false,
      show_romanization: false,
      parser_type: "spacedel",
      // minimum dictionaries should be defined on backend with other settings
      dictionaries: [
        {
          for: "terms",
          type: "embedded",
          url: "",
          active: true,
          key: randomId(),
        },
        {
          for: "sentences",
          type: "popup",
          url: "",
          active: true,
          key: randomId(),
        },
      ],
    },
  });

  return form;
}

export default useLanguageForm;
