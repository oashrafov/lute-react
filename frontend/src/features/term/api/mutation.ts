import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  termCreated,
  termDeleted,
  termUpdated,
} from "../resources/notifications";
import { api } from "./api";
import type { TermDetail } from "./types";

export const mutation = {
  useCreateTerm() {
    return useMutation({
      mutationFn: api.create,
      onSuccess: () => {
        notifications.show(termCreated);
      },
    });
  },

  useEditTerm() {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: TermDetail }) =>
        api.edit(id, data),
      onSuccess: () => {
        notifications.show(termUpdated);
      },
    });
  },

  useDeleteTerm() {
    return useMutation({
      mutationFn: api.delete,
      onSuccess: () => {
        notifications.show(termDeleted);
      },
    });
  },
};
