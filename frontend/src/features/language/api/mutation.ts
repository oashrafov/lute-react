import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import { queries as bookQueries } from "../../book/api/queries";
import { queries as settingsQueries } from "../../settings/api/queries";
import { queries as langQueries } from "./queries";

export const mutation = {
  useCreateLanguage() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({
        name,
        loadStories,
      }: {
        name: string;
        loadStories?: boolean;
      }) => api.create(name, loadStories),
      onSuccess: async () => {
        queryClient.removeQueries({
          queryKey: bookQueries.all(),
        });
        await Promise.all([
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
      },
    });
  },
};
