import { getRouteApi } from "@tanstack/react-router";
import { Slider, type SliderProps } from "@mantine/core";
import type { BookDetail } from "../../../../../api/types";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

interface PageSlider extends SliderProps {
  book: BookDetail;
}

export function PageSlider({ book, ...props }: PageSlider) {
  const { pageNum } = route.useParams();
  return (
    <Slider
      {...props}
      style={{ flex: 1 }}
      size="md"
      thumbSize={16}
      defaultValue={pageNum}
      min={1}
      max={book.pageCount}
      disabled={book.pageCount === 1}
      showLabelOnHover={false}
    />
  );
}
