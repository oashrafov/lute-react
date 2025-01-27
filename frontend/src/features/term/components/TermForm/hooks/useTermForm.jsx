import { useForm } from "@mantine/form";

function useTermForm(term, language) {
  const form = useForm({
    initialValues: term && {
      ...term,
      status: String(term.status),
    },
    enhanceGetInputProps: ({ form, field }) => {
      if (!form.initialized) return;

      if (field === "syncStatus") {
        const parentsCount = form.getValues().parents.length;

        if (!parentsCount || parentsCount > 1)
          return {
            disabled: true,
            checked: false,
          };

        return { disabled: false, checked: form.getValues().syncStatus };
      }
    },
    transformValues: (values) => {
      // console.log(values);
      return {
        // id: term.id,
        language_id: Number(language.id),
        original_text: values.originalText,
        text: values.text,
        parentslist: values.parents,
        translation: values.translation,
        romanization: values.romanization,
        status: Number(values.status),
        sync_status: values.syncStatus,
        termtagslist: values.termTags,
      };
    },
  });

  return form;
}

export default useTermForm;
