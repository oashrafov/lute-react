import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { bookDeleted, bookUpdated } from "@book/resources/notifications";
import { errorMessage } from "@resources/notifications";
import { createBook, deleteBook, editBook } from "./api";
import { keys as bookKeys } from "./keys";
import { keys as settingsKeys } from "@settings/api/keys";

function useCreateBook() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.books });
      queryClient.invalidateQueries({ queryKey: settingsKeys.initial });
      navigate(`/books/${response.id}/pages/1`);
    },
    onError: (error) => notifications.show(errorMessage(error.message)),
  });

  return mutation;
}

function useEditBook() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editBook,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.books });
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
      queryClient.invalidateQueries({ queryKey: bookKeys.books });
      queryClient.invalidateQueries({ queryKey: settingsKeys.initial });
      notifications.show(bookDeleted(response.title));
    },
  });

  return mutation;
}

export { useCreateBook, useEditBook, useDeleteBook };
