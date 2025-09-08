import { useParams } from "react-router-dom";
import { Slider, type SliderProps } from "@mantine/core";
import type { BookDetail } from "../../../../../api/types";

interface PageSlider extends SliderProps {
  book: BookDetail;
}

export function PageSlider({ book, ...props }: PageSlider) {
  const params = useParams();
  const page = Number(params.page);
  return (
    <Slider
      {...props}
      style={{ flex: 1 }}
      size="md"
      thumbSize={16}
      defaultValue={page}
      min={1}
      max={book.pageCount}
      disabled={book.pageCount === 1}
      showLabelOnHover={false}
    />
  );
}
