import { Link } from "react-router-dom";
import { ActionIcon, Image } from "@mantine/core";

export function HomeImageLink({ size }) {
  return (
    <ActionIcon component={Link} to="/" variant="transparent" size={size}>
      <Image
        w={size}
        h={size}
        src="/images/logo.png"
        style={{ objectFit: "contain" }}
      />
    </ActionIcon>
  );
}
