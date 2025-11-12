import { getRouteApi } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { bookDeleted, bookUpdated } from "../resources/notifications";
import { errorMessage } from "../../../resources/notifications";
import { queries as bookQueries } from "./queries";
import { queries as settingsQueries } from "../../settings/api/queries";
import { api } from "./api";
import type { EditAction } from "./types";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export const mutation = {
  useCreateBook() {
    const navigate = route.useNavigate();

    return useMutation({
      mutationFn: api.create,
      onSuccess: (...[response, , , context]) => {
        context.client.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        });
        context.client.invalidateQueries({
          queryKey: settingsQueries.init().queryKey,
        });
        navigate({ params: { bookId: response.id, pageNum: 1 } });
      },
      onError: (error) => notifications.show(errorMessage(error.message)),
    });
  },

  useEditBook() {
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: number;
        data: EditAction;
        userData?: Record<string, unknown>;
      }) => api.edit(id, data),
      onSuccess: (...[response, { userData }, , context]) => {
        context.client.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        });
        if (userData?.showNotification ?? true) {
          notifications.show(bookUpdated(response.title));
        }
      },
    });
  },

  useDeleteBook() {
    return useMutation({
      mutationFn: api.delete,
      onSuccess: (...[response, , , context]) => {
        context.client.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        });
        context.client.invalidateQueries({
          queryKey: settingsQueries.init().queryKey,
        });
        notifications.show(bookDeleted(response.title));
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
    const { bookId, pageNum } = route.useParams();

    return useMutation({
      mutationFn: ({ bookId, pageNum }: { bookId: number; pageNum: number }) =>
        api.processPage(bookId, pageNum),
      onSuccess: (...[, , , context]) => {
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
