import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ActionIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { createLanguage } from "../../../../language/api/api";
import { sampleBooksAdded } from "../../../resources/notifications";
import { queries as langQueries } from "../../../../language/api/queries";
import { queries as bookQueries } from "../../../api/queries";
import { queries as settingsQueries } from "../../../../settings/api/queries";

interface LoadSampleBooksButton {
  langName: string;
  onSuccess?: (langName: string) => void;
  onConfirm?: () => void;
}

export function LoadSampleBooksButton({
  langName,
  onSuccess,
  onConfirm,
}: LoadSampleBooksButton) {
  const queryClient = useQueryClient();

  const loadSampleStoriesMutation = useMutation({
    mutationFn: createLanguage,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: settingsQueries.init().queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: langQueries.userLanguagesList().queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: langQueries.predefinedLanguagesList().queryKey,
        }),
      ]);
      notifications.show(
        sampleBooksAdded(`Sample book(s) for "${langName}" added`)
      );
      onSuccess?.(langName);
    },
  });

  function handleClick() {
    loadSampleStoriesMutation.mutate({
      name: langName,
      loadStories: true,
    });
    onConfirm?.();
  }

  return (
    <ActionIcon size="md" variant="light" onClick={handleClick}>
      <IconCheck />
    </ActionIcon>
  );
}
