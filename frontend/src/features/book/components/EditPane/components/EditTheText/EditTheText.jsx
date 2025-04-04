import { Textarea } from "@mantine/core";
import { useField } from "@mantine/form";
import classes from "../../EditPane.module.css";

function EditTheText({ text, textDirection }) {
  const field = useField({ initialValue: text });
  return (
    <Textarea
      className={classes.textarea}
      wrapperProps={{ dir: textDirection }}
      size="lg"
      autosize
      spellCheck={false}
      autoCapitalize="off"
      autoFocus
      {...field.getInputProps("text")}
    />
  );
}

export default EditTheText;
