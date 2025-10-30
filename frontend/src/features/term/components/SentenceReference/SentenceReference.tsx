import { Link } from "@tanstack/react-router";
import type { SentenceRef } from "../../api/types";
import classes from "./SentenceReference.module.css";

interface SentenceReference {
  data: SentenceRef;
}

export function SentenceReference({ data }: SentenceReference) {
  return (
    <>
      <p
        dangerouslySetInnerHTML={{
          __html: data.sentence,
        }}
      />
      <Link
        to="/books/$bookId/pages/$pageNum"
        params={{ bookId: data.bookId, pageNum: data.pageNumber }}
        target="_blank"
        className={classes.bookLink}>
        {data.bookTitle}
      </Link>
    </>
  );
}
