import { Box, Transition } from "@mantine/core";
import { useForm } from "react-hook-form";
import { EditHeader } from "./components/EditHeader/EditHeader";
import { useBookQuery } from "../../hooks/useBookQuery";
import { usePageQuery } from "../../hooks/usePageQuery";
import { Textarea } from "../../../../components/common/Textarea/Textarea";
import { useView } from "../../hooks/useView";
import classes from "./EditView.module.css";

export function EditView() {
  const { view } = useView();
  const show = view === "edit";
  const { data: book } = useBookQuery();
  const { data: page } = usePageQuery();

  const { control } = useForm({
    defaultValues: { text: page.text },
  });

  return (
    <>
      <Transition transition="slide-down" mounted={show}>
        {(styles) => (
          <Box style={styles}>
            <EditHeader book={book} />
          </Box>
        )}
      </Transition>
      <Transition transition="fade" mounted={show}>
        {(styles) => (
          <Box style={styles}>
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
          </Box>
        )}
      </Transition>
    </>
  );
}
