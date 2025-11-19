import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { demoDataCleared, demoDeactivated } from "#resources/notifications";
import { queries as bookQueries } from "#book/api/queries";
import { queries as settingsQueries } from "./queries";
import { api } from "./api";

export function useClearDemoData() {
  return useMutation({
    mutationFn: api.clearDemoData,
    onSuccess: async (_data, _variables, _onMutateResult, context) => {
      context.client.removeQueries({
        queryKey: bookQueries.all(),
      });
      await context.client.invalidateQueries({
        queryKey: settingsQueries.init().queryKey,
      });
      notifications.show(demoDataCleared);
    },
  });
}

export function useDeactivateDemoMode() {
  return useMutation({
    mutationFn: api.deactivateDemoMode,
    onSuccess: (_data, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: settingsQueries.init().queryKey,
      });
      notifications.show(demoDeactivated);
    },
  });
}
