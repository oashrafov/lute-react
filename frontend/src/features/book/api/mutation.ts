import { getRouteApi } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { bookDeleted, bookUpdated } from "../resources/notifications";
import { errorMessage } from "#resources/notifications";
import { queries as bookQueries } from "./queries";
import { queries as settingsQueries } from "#settings/api/queries";
import { api } from "./api";
import type { EditAction } from "./types";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

interface EditBookData {
  id: number;
  data: EditAction;
  userData?: Record<string, unknown>;
}

interface ProcessPageData {
  bookId: number;
  pageNum: number;
}

export const mutation = {
  useCreateBook() {
    const navigate = route.useNavigate();

    return useMutation({
      mutationFn: api.create,
      onSuccess: (data, _variables, _onMutateResult, context) => {
        context.client.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        });
        context.client.invalidateQueries({
          queryKey: settingsQueries.init().queryKey,
        });
        navigate({ params: { bookId: data.id, pageNum: 1 } });
      },
      onError: (error) => notifications.show(errorMessage(error.message)),
    });
  },

  useEditBook() {
    return useMutation({
      mutationFn: ({ id, data }: EditBookData) => api.edit(id, data),
      onSuccess: (data, { userData }, _onMutateResult, context) => {
        context.client.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        });
        if (userData?.showNotification ?? true) {
          notifications.show(bookUpdated(data.title));
        }
      },
    });
  },

  useDeleteBook() {
    return useMutation({
      mutationFn: api.delete,
      onSuccess: (data, _variables, _onMutateResult, context) => {
        context.client.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        });
        context.client.invalidateQueries({
          queryKey: settingsQueries.init().queryKey,
        });
        notifications.show(bookDeleted(data.title));
      },
    });
  },

  useGenerateContentFromURL() {
    return useMutation({
      mutationFn: api.generateContentFromURL,
      onError: (error) => notifications.show(errorMessage(error.message)),
    });
  },

  useProcessPage() {
    return useMutation({
      mutationFn: ({ bookId, pageNum }: ProcessPageData) =>
        api.processPage(bookId, pageNum),
      onSuccess: (_data, { bookId, pageNum }, _onMutateResult, context) => {
        context.client.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        });
        context.client.invalidateQueries({
          queryKey: bookQueries.page(bookId, pageNum).queryKey,
        });
      },
    });
  },
};
