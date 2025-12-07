import { useNavigate } from "@tanstack/react-router";
import { ActionIcon } from "@mantine/core";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";

export function OpenLanguageFormButton() {
  const navigate = useNavigate({ from: "/create-book" });
  return (
    <ActionIcon
      size="input-sm"
      variant="transparent"
      color="green.6"
      onClick={() =>
        navigate({
          search: (prev) => ({ ...prev, langForm: true }),
        })
      }>
      <IconSquareRoundedPlusFilled />
    </ActionIcon>
  );
}
