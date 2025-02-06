import { useForm } from "@mantine/form";
import { getFormDataFromObj } from "@actions/utils";

function useNewBookForm(langId) {
  const form = useForm({
    initialValues: {
      language_id: "",
      title: "",
      text: "",
      importurl: "",
      text_file: undefined,
      audio_file: undefined,
      threshold_page_tokens: 250,
      split_by: "paragraphs",
      source_uri: "",
      book_tags: [],
    },
    transformValues: (values) => {
      const data = {
        ...values,
        language_id: Number(langId),
      };

      return getFormDataFromObj(data);
    },
  });

  return form;
}

export default useNewBookForm;
