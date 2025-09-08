import { useQuery } from "@tanstack/react-query";
import { NoSentences } from "../NoSentences/NoSentences";
import { PageSpinner } from "../../../../components/common/PageSpinner/PageSpinner";
import { queries } from "../../api/queries";
import classes from "./Sentences.module.css";

interface Sentences {
  langId: number;
  termText: string;
}

export function Sentences({ langId, termText }: Sentences) {
  const { data } = useQuery(queries.sentences(termText, langId));

  if (!data) {
    return <PageSpinner />;
  }

  return (
    <div className={classes.container}>
      {data.variations.length === 0 && <NoSentences text={data.text} />}
      {data.variations.length > 0 && (
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
