import { useController, useFormContext } from "react-hook-form";
import { Center, Group } from "@mantine/core";
import { UserLanguageSelect } from "#language/components/UserLanguageSelect/UserLanguageSelect";
import { OpenLanguageFormButton } from "../components/OpenLanguageFormButton";
import type { CreateBookForm } from "#book/api/types";

export function Step1() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateBookForm>();

  const {
    field: { onChange, value, ref, ...rest },
  } = useController({ control, name: "language_id" });

  function handleLanguageChange(id: string | null) {
    if (id) {
      onChange(Number(id));
    }
  }

  return (
    <Center>
      <UserLanguageSelect
        onChange={handleLanguageChange}
        value={String(value)}
        required
        withAsterisk
        error={errors.language_id?.message}
        {...rest}
        inputContainer={(input) => (
          <Group gap={5}>
            {input}
            <OpenLanguageFormButton
              mb={errors.language_id?.message ? 5 : undefined}
            />
          </Group>
        )}
      />
    </Center>
  );
}
