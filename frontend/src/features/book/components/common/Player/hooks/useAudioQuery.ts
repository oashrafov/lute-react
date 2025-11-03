import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { errorMessage } from "../../../../../../resources/notifications";
import { queries } from "../../../../api/queries";
import type { BookDetail } from "../../../../api/types";

export function useAudioQuery(book: BookDetail) {
  const { data: audioSource, error } = useQuery(
    queries.audio(book.audio ? book.id : undefined)
  );

  useEffect(() => {
    if (book.audio && error) {
      notifications.show(errorMessage(error.message));
    }
  }, [book.audio, error]);

  return audioSource;
}
