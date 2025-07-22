import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ActionIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { keys as bookKeys } from "@book/api/keys";
import { keys as settingsKeys } from "@settings/api/keys";
import { keys as languageKeys } from "@language/api/keys";
import { createLanguage } from "@language/api/api";
import { sampleBooksAdded } from "@book/resources/notifications";

export function LoadSampleBooksButton({ langName, onSuccess, onConfirm }) {
  const queryClient = useQueryClient();

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

  function handleClick() {
    loadSampleStoriesMutation.mutate({
      name: langName,
      loadStories: true,
    });
    onConfirm();
  }

  return (
    <ActionIcon size="md" variant="light" onClick={handleClick}>
      <IconCheck />
    </ActionIcon>
  );
}
