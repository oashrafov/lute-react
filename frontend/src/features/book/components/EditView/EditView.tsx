import { EditHeader } from "./components/EditHeader/EditHeader";
import { EditTheText } from "./components/EditTheText/EditTheText";
import { Box, Transition } from "@mantine/core";
import { useBookQuery } from "../../hooks/useBookQuery";
import { useViewContext } from "../../hooks/useViewContext";
import { usePageQuery } from "../../hooks/usePageQuery";

export function EditView() {
  const { view } = useViewContext();
  const show = view === "edit";
  const { data: book } = useBookQuery();
  const { data: page } = usePageQuery();
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
            <EditTheText text={page.text} textDirection={book.textDirection} />
          </Box>
        )}
      </Transition>
    </>
  );
}
