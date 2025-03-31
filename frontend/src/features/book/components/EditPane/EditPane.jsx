import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { getPageQuery } from "../../api/query";
import EditHeader from "./components/EditHeader/EditHeader";
import EditTheText from "./components/EditTheText/EditTheText";

function EditPane({ book, textDirection }) {
  const { id, page: pageNum } = useParams();
  const { data: page } = useQuery(getPageQuery(id, pageNum));
  const [, setParams] = useSearchParams();

  return (
    <>
      <EditHeader book={book} page={pageNum} onSetEdit={setParams} />
      <EditTheText text={page.text} textDirection={textDirection} />
    </>
  );
}

export default EditPane;
