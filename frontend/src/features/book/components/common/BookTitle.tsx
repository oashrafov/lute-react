import { Title, type TitleProps } from "@mantine/core";
import { useParams } from "react-router-dom";

interface BookTitle extends TitleProps {
  children: string;
}

export function BookTitle(props: BookTitle) {
  const { children, ...titleProps } = props;
  const params = useParams();
  const page = Number(params.page);
  return (
    <Title
      fw="normal"
      fz="inherit"
      lineClamp={1}
      component={page === 1 ? "h2" : "h1"}
      {...titleProps}>
      {children}
    </Title>
  );
}
