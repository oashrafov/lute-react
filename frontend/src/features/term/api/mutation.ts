import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  termCreated,
  termDeleted,
  termUpdated,
} from "../resources/notifications";
import { api } from "./api";
import { queries } from "#book/api/queries";
import type { TermDetail } from "./types";

export const mutation = {
  useCreateTerm() {
    return useMutation({
      mutationFn: api.create,
      onSuccess(_data, _variables, _onMutateResult, context) {
        notifications.show(termCreated);
        context.client.invalidateQueries({
          queryKey: queries.allPages(),
        });
        context.client.invalidateQueries({
          queryKey: queries.allStats(),
        });
      },
    });
  },

  useEditTerm() {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: TermDetail }) =>
        api.edit(id, data),
      onSuccess: (_data, _variables, _onMutateResult, context) => {
        notifications.show(termUpdated);
        context.client.invalidateQueries({
          queryKey: queries.allPages(),
        });
        context.client.invalidateQueries({
          queryKey: queries.allStats(),
        });
      },
    });
  },

  useDeleteTerm() {
    return useMutation({
      mutationFn: api.delete,
      onSuccess: (_data, _variables, _onMutateResult, context) => {
        notifications.show(termDeleted);
        context.client.invalidateQueries({
          queryKey: queries.allPages(),
        });
        context.client.invalidateQueries({
          queryKey: queries.allStats(),
        });
      },
    });
  },
};
