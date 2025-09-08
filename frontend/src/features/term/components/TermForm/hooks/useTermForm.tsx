import { useForm } from "@mantine/form";
import type { TermDetail } from "../../../api/types";
import type { UserLanguageDetail } from "../../../../language/api/types";

export function useTermForm(term: TermDetail, language: UserLanguageDetail) {
  return useForm({
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
}
