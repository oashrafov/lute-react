import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { bookDeleted, bookUpdated } from "@book/resources/notifications";
import { deleteBook, editBook } from "./api";
import { keys } from "./keys";

function useEditBook() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editBook,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: keys.books });
      notifications.show(bookUpdated(response.title));
    },
  });

  return mutation;
}

function useDeleteBook() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: keys.books });
      notifications.show(bookDeleted(response.title));
    },
  });

  return mutation;
}

export { useEditBook, useDeleteBook };
