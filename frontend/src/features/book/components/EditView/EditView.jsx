import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPageQuery } from "../../api/query";
import { EditHeader } from "./components/EditHeader/EditHeader";
import { EditTheText } from "./components/EditTheText/EditTheText";
import { Box, Transition } from "@mantine/core";
import { useBook } from "@book/hooks/useBook";

export function EditView({ show }) {
  const { book, language } = useBook();
  const textDirection = language.right_to_left ? "rtl" : "ltr";
  const { id, page: pageNum } = useParams();
  const { data: page } = useQuery(getPageQuery(id, pageNum));
  return (
    <>
      <Transition transition="slide-down" mounted={show} keepMounted>
        {(styles) => (
          <Box style={styles}>
            <EditHeader book={book} page={pageNum} />
          </Box>
        )}
      </Transition>
      <Transition transition="fade" mounted={show} keepMounted>
        {(styles) => (
          <Box style={styles}>
            <EditTheText text={page.text} textDirection={textDirection} />
          </Box>
        )}
      </Transition>
    </>
  );
}
