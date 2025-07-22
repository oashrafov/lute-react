import { useQuery } from "@tanstack/react-query";
import { LoadingOverlay } from "@mantine/core";
import { getSentencesQuery } from "../../api/query";
import { NoSentences } from "../NoSentences/NoSentences";
import classes from "./Sentences.module.css";

export function Sentences({ langId, termText }) {
  const { data } = useQuery(getSentencesQuery(termText, langId));
  return (
    <div className={classes.container}>
      <LoadingOverlay
        visible={!data}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      {data?.variations.length === 0 && <NoSentences text={data.text} />}

      {data?.variations.length > 0 && (
        <ul className={classes.mainList}>
          {data.variations.map(
            ({ term, references }) =>
              references.length > 0 && (
                <li key={term}>
                  <p className={classes.term}>{term}</p>
                  <ul className={classes.innerList}>
                    {references.map((reference) => (
                      <li key={reference.id}>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: reference.sentence,
                          }}
                        />
                        <a
                          href={`/books/${reference.bookId}/pages/${reference.pageNumber}`}
                          target="_blank"
                          className={classes.bookLink}>
                          {reference.bookTitle}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )
          )}
        </ul>
      )}
    </div>
  );
}
