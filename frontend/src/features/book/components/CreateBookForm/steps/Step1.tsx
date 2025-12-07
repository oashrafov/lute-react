import { useFormContext } from "react-hook-form";
import { Group } from "@mantine/core";
import { UserLanguageSelect } from "#language/components/UserLanguageSelect/UserLanguageSelect";
import { OpenLanguageFormButton } from "../components/OpenLanguageFormButton";
import type { CreateBookForm } from "#book/api/types";

export function Step1() {
  const { setValue } = useFormContext<CreateBookForm>();
  function handleLanguageChange(id: string | null) {
    if (id) {
      setValue("language_id", id);
    }
  }

  return (
    <Group gap={0} justify="center" align="flex-end">
      <UserLanguageSelect
        onChange={handleLanguageChange}
        required
        withAsterisk
      />
      <OpenLanguageFormButton />
    </Group>
  );
}
