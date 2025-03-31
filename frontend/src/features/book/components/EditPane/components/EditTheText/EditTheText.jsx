import { Textarea } from "@mantine/core";
import { useField } from "@mantine/form";

function EditTheText({ text, textDirection }) {
  const field = useField({ initialValue: text });
  return (
    <Textarea
      wrapperProps={{ dir: textDirection }}
      size="lg"
      w="50%"
      ml="auto"
      mr="auto"
      resize="vertical"
      autosize
      spellCheck={false}
      autoCapitalize="off"
      autoFocus
      {...field.getInputProps("text")}
    />
  );
}

export default EditTheText;
