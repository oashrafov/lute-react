import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateDemoMode, wipeDemoDatabase } from "./api";
import { notifications } from "@mantine/notifications";
import {
  databaseCleaned,
  demoDeactivated,
} from "../../../resources/notifications";
import { queries as bookQueries } from "../../book/api/queries";
import { queries as settingsQueries } from "./queries";

export function useWipeDatabase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wipeDemoDatabase,
    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: bookQueries.all(),
      });
      await queryClient.invalidateQueries({
        queryKey: settingsQueries.init().queryKey,
      });
      notifications.show(databaseCleaned);
    },
  });
}

export function useDeactivateDemoMode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateDemoMode,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: settingsQueries.init().queryKey,
      });
      notifications.show(demoDeactivated);
    },
  });
}
