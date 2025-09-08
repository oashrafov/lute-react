import { Title } from "@mantine/core";
import { useParams } from "react-router-dom";

interface BookTitle {
  children: string;
}

export function BookTitle({ children }: BookTitle) {
  const params = useParams();
  const page = Number(params.page);
  return (
    <Title
      fw="normal"
      fz="inherit"
      lineClamp={1}
      component={page === 1 ? "h2" : "h1"}>
      {children}
    </Title>
  );
}
