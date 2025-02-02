import { Badge } from "@mantine/core";

function PageCounter({ counter }) {
  return (
    <Badge ml="auto" variant="light" fw={600}>
      {counter}
    </Badge>
  );
}

export default PageCounter;
