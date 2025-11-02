import { getRouteApi } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    const queryClient = useQueryClient();
    const navigate = route.useNavigate();

    return useMutation({
      mutationFn: api.create,
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: settingsQueries.init().queryKey,
        });
        navigate({ params: { bookId: response.id, pageNum: 1 } });
      },
      onError: (error) => notifications.show(errorMessage(error.message)),
    });
  },

  useEditBook() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: EditAction }) =>
        api.edit(id, data),
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        });
        notifications.show(bookUpdated(response.title));
      },
    });
  },

  useDeleteBook() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: api.delete,
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        });
        queryClient.invalidateQueries({
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
    const queryClient = useQueryClient();
    const { bookId, pageNum } = route.useParams();

    return useMutation({
      mutationFn: ({ bookId, pageNum }: { bookId: number; pageNum: number }) =>
        api.processPage(bookId, pageNum),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: bookQueries.list().queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: bookQueries.page(bookId, pageNum).queryKey,
        });
      },
    });
  },
};
