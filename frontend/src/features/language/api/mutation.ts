import { useMutation } from "@tanstack/react-query";
import { api } from "./api";
import { queries as bookQueries } from "../../book/api/queries";
import { queries as settingsQueries } from "../../settings/api/queries";
import { queries as langQueries } from "./queries";

export const mutation = {
  useCreateLanguage() {
    return useMutation({
      mutationFn: ({
        name,
        loadStories,
      }: {
        name: string;
        loadStories?: boolean;
      }) => api.create(name, loadStories),
      onSuccess: async (...[, , , context]) => {
        context.client.removeQueries({
          queryKey: bookQueries.all(),
        });
        await Promise.all([
          context.client.invalidateQueries({
            queryKey: settingsQueries.init().queryKey,
          }),
          context.client.invalidateQueries({
            queryKey: langQueries.userLanguagesList().queryKey,
          }),
          context.client.invalidateQueries({
            queryKey: langQueries.predefinedLanguagesList().queryKey,
          }),
        ]);
      },
    });
  },
};
