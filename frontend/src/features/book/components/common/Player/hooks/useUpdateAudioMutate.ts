import { useCallback } from "react";
import { mutation } from "#book/api/mutation";
import { queries } from "#book/api/queries";

export function useUpdateAudioMutate() {
  const { mutate } = mutation.useEditBook();
  return useCallback(
    (id: number, bookmarks?: string, position?: number) => {
      mutate(
        {
          id,
          data: {
            action: "updateAudioData",
            bookmarks,
            position,
          },
          userData: {
            showNotification: false,
          },
        },
        {
          onSuccess: (...[, , , context]) => {
            if (position == undefined) {
              context.client.invalidateQueries({
                queryKey: queries.detail(id).queryKey,
              });
            }
          },
        }
      );
    },
    [mutate]
  );
}
