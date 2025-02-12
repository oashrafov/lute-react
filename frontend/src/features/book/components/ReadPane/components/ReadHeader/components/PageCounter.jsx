import { Badge } from "@mantine/core";

function PageCounter({ counter }) {
  return (
    <Badge ml="auto" variant="light" fw={600} miw="max-content">
      {counter}
    </Badge>
  );
}

export default PageCounter;
