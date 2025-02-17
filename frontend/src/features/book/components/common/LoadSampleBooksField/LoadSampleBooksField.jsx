import { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { ActionIcon, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconSelector } from "@tabler/icons-react";
import { predefinedLanguagesQuery } from "@language/api/query";
import { initialQuery } from "@settings/api/settings";
import { keys as bookKeys } from "@book/api/keys";
import { keys as settingsKeys } from "@settings/api/keys";
import { keys as languageKeys } from "@language/api/keys";
import { createLanguage } from "@language/api/api";
import { sampleBooksAdded } from "@book/resources/notifications";

function LoadSampleBooksField({
  label,
  placeholder,
  description,
  width,
  onSuccess,
  onConfirm,
}) {
  const queryClient = useQueryClient();
  const { data: initial } = useQuery(initialQuery);
  const { data: predefined } = useQuery(predefinedLanguagesQuery);
  const [langName, setLangName] = useState("");

  const loadSampleStoriesMutation = useMutation({
    mutationFn: createLanguage,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: bookKeys.books }),
        queryClient.invalidateQueries({ queryKey: settingsKeys.initial }),
        queryClient.invalidateQueries({ queryKey: languageKeys.userLanguages }),
        queryClient.invalidateQueries({
          queryKey: languageKeys.predefinedLanguages,
        }),
      ]);
      notifications.show(
        sampleBooksAdded(`Sample book(s) for "${langName}" added`)
      );
      onSuccess(langName);
    },
  });

  return (
    <Select
      w={width}
      autoFocus={false}
      display="inline-block"
      data={predefined || []}
      label={label}
      description={description}
      placeholder={placeholder}
      allowDeselect={false}
      withCheckIcon={false}
      searchable={true}
      value={langName}
      onChange={setLangName}
      comboboxProps={{ withinPortal: !initial.haveLanguages }}
      rightSection={
        langName ? (
          <ActionIcon
            size="md"
            variant="light"
            onClick={() => {
              loadSampleStoriesMutation.mutate({
                name: langName,
                loadStories: true,
              });
              onConfirm();
            }}>
            <IconCheck />
          </ActionIcon>
        ) : (
          <IconSelector size={16} />
        )
      }
      rightSectionPointerEvents={langName === null ? "none" : "all"}
    />
  );
}

export default LoadSampleBooksField;
