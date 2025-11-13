import { useForm } from "react-hook-form";
import { EditHeader } from "./components/EditHeader/EditHeader";
import { useBookQuery } from "../../hooks/useBookQuery";
import { usePageQuery } from "../../hooks/usePageQuery";
import { Textarea } from "../../../../components/common/Textarea/Textarea";
import classes from "./EditView.module.css";

export function EditView() {
  const { data: book } = useBookQuery();
  const { data: page } = usePageQuery();

  const { control } = useForm({ defaultValues: { text: page.text } });

  return (
    <>
      <EditHeader book={book} />
      <Textarea
        name="text"
        control={control}
        className={classes.textarea}
        wrapperProps={{ dir: book.textDirection }}
        size="lg"
        autosize
        spellCheck={false}
        autoCapitalize="off"
        autoFocus
      />
    </>
  );
}
