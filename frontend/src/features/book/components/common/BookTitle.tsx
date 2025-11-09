import { Title, type TitleProps } from "@mantine/core";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function BookTitle({ children, ...rest }: TitleProps) {
  const { pageNum } = route.useParams();
  return (
    <Title
      fw="normal"
      fz="inherit"
      lineClamp={1}
      component={pageNum === 1 ? "h2" : "h1"}
      {...rest}>
      {children}
    </Title>
  );
}
