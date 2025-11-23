import { useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { EditHeader } from "./components/EditHeader/EditHeader";
import { usePageQuery } from "#book/hooks/usePageQuery";
import { Textarea } from "#common/Textarea/Textarea";
import classes from "./EditView.module.css";

export function EditView() {
  const { textDir } = useSearch({ strict: false });
  const { data: page } = usePageQuery();
  const { control } = useForm({ defaultValues: { text: page.text } });

  return (
    <>
      <EditHeader />
      <Textarea
        name="text"
        control={control}
        className={classes.textarea}
        wrapperProps={{ dir: textDir }}
        size="lg"
        autosize
        spellCheck={false}
        autoCapitalize="off"
        autoFocus
      />
    </>
  );
}
