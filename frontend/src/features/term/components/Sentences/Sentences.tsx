import { useQuery } from "@tanstack/react-query";
import { NoSentences } from "../NoSentences/NoSentences";
import { SentenceReference } from "../SentenceReference/SentenceReference";
import { SentencesSkeleton } from "./SentencesSkeleton";
import { queries } from "#term/api/queries";
import classes from "./Sentences.module.css";

interface Sentences {
  langId: number;
  termText: string;
}

export function Sentences({ langId, termText }: Sentences) {
  const { data } = useQuery(queries.sentences(termText, langId));
  return (
    <div className={classes.container}>
      {!data && <SentencesSkeleton />}
      {data && data.variations.length === 0 && <NoSentences text={data.text} />}
      {data && data.variations.length > 0 && (
        <ul className={classes.mainList}>
          {data.variations.map(
            ({ term, references }) =>
              references.length > 0 && (
                <li key={term}>
                  <p className={classes.term}>{term}</p>
                  <ul className={classes.innerList}>
                    {references.map((reference) => (
                      <li key={reference.id}>
                        <SentenceReference data={reference} />
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
