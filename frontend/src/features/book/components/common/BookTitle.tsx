import { Title, type TitleProps } from "@mantine/core";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");
interface BookTitle extends TitleProps {
  children: string;
}

export function BookTitle(props: BookTitle) {
  const { children, ...titleProps } = props;
  const { pageNum } = route.useParams();

  return (
    <Title
      fw="normal"
      fz="inherit"
      lineClamp={1}
      component={pageNum === 1 ? "h2" : "h1"}
      {...titleProps}>
      {children}
    </Title>
  );
}
