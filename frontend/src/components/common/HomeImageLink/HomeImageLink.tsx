import { Link } from "@tanstack/react-router";
import { ActionIcon, Image } from "@mantine/core";

interface HomeImageLink {
  size: number;
}

export function HomeImageLink({ size }: HomeImageLink) {
  return (
    <ActionIcon
      variant="transparent"
      size={size}
      renderRoot={(props) => <Link to="/" {...props} />}>
      <Image
        w={size}
        h={size}
        src="/images/logo.png"
        style={{ objectFit: "contain" }}
      />
    </ActionIcon>
  );
}
