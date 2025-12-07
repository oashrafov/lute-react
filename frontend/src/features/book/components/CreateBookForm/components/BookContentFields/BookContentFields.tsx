import { useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActionIcon, Collapse, Stack } from "@mantine/core";
import { IconHeading, IconUpload, IconWorldWww } from "@tabler/icons-react";
import { Textarea } from "#common/Textarea/Textarea";
import { TextInput } from "#common/TextInput/TextInput";
import { BookURLInput } from "./BookURLInput";
import { BookFileInput } from "./BookFileInput";

export function BookContentFields() {
  const { t } = useTranslation("form", { keyPrefix: "newBook" });
  const { control } = useFormContext();
  const { textDir } = useSearch({ from: "/create-book" });
  const [visibleInput, setVisibleInput] = useState<"file" | "url" | null>(null);

  const generateContentButtons = (
    <Stack gap={2}>
      <ActionIcon
        variant={visibleInput === "file" ? "light" : "subtle"}
        onClick={() => setVisibleInput((v) => (v === "file" ? null : "file"))}>
        <IconUpload />
      </ActionIcon>
      <ActionIcon
        variant={visibleInput === "url" ? "light" : "subtle"}
        onClick={() => setVisibleInput((v) => (v === "url" ? null : "url"))}>
        <IconWorldWww />
      </ActionIcon>
    </Stack>
  );

  return (
    <>
      <TextInput
        name="title"
        control={control}
        wrapperProps={{ dir: textDir }}
        required
        withAsterisk
        label={t("titleLabel")}
        leftSection={<IconHeading />}
      />
      <Textarea
        name="text"
        control={control}
        label={t("textLabel")}
        wrapperProps={{ dir: textDir }}
        required
        withAsterisk
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        resize="vertical"
        autosize
        minRows={10}
        maxRows={20}
        leftSection={generateContentButtons}
        leftSectionProps={{ style: { alignItems: "flex-start", top: 7 } }}
      />
      <Collapse in={visibleInput === "file"}>
        <BookFileInput />
      </Collapse>
      <Collapse in={visibleInput === "url"}>
        <BookURLInput />
      </Collapse>
    </>
  );
}
