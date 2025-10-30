import { getRouteApi } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { bookDeleted, bookUpdated } from "../resources/notifications";
import { errorMessage } from "../../../resources/notifications";
import { createBook, deleteBook, editBook } from "./api";
import { queries as bookQueries } from "./queries";
import { queries as settingsQueries } from "../../settings/api/queries";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function useCreateBook() {
  const queryClient = useQueryClient();
  const navigate = route.useNavigate();

  return useMutation({
    mutationFn: createBook,
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
}

export function useEditBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editBook,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: bookQueries.list().queryKey,
      });
      notifications.show(bookUpdated(response.title));
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
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
}
