import { forwardRef, memo, type ComponentPropsWithoutRef } from "react";
import { clsx } from "clsx";
import type { Textitem } from "../../../api/types";
import { TEXTITEM_CLASS } from "../../../../../resources/constants";

const TextItem = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<"span"> & { data: Textitem }
>(function TextItem(props, ref) {
  const { data, ...restProps } = props;

  const classes = clsx("textitem", {
    [TEXTITEM_CLASS.word]: data.isWord,
    [TEXTITEM_CLASS.overlapped]: data.isOverlapped,
  });

  return (
    <span
      ref={ref}
      {...restProps}
      id={String(data.id)}
      className={classes}
      data-highlight-type="none"
      data-lang-id={data.langId}
      data-paragraph-id={data.paragraphId}
      data-sentence-id={data.sentenceId}
      data-sentence-start={data.isSentenceStart}
      data-text={data.text}
      data-status={data.status}
      data-order={data.order}
      data-wid={data.wid}>
      {data.displayText}
    </span>
  );
});

export default memo(TextItem);
