import { useParams } from "react-router-dom";
import { Slider } from "@mantine/core";

function PageSlider({ book, value, onChange, onChangeEnd }) {
  const params = useParams();
  const page = Number(params.page);

  return (
    <Slider
      style={{ flex: 1 }}
      size="md"
      thumbSize={16}
      value={value}
      defaultValue={page}
      onChange={onChange}
      onChangeEnd={onChangeEnd}
      min={1}
      max={book.pageCount}
      disabled={book.pageCount === 1}
      showLabelOnHover={false}
    />
  );
}

export default PageSlider;
