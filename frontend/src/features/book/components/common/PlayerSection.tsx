import { useEffect } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Player } from "./Player/Player";
import { MediaNotFoundOverlay } from "./Player/components/MediaNotFoundOverlay/MediaNotFoundOverlay";
import { errorMessage } from "#resources/notifications";
import { queries } from "#book/api/queries";

const route = getRouteApi("/books/$bookId/pages/$pageNum/");

export function PlayerSection() {
  const { bookId } = route.useParams();
  const { data, isError, error } = useQuery(queries.audioSrc(bookId));

  useEffect(() => {
    if (error) {
      notifications.show(errorMessage(error.message));
    }
  }, [error]);

  return (
    <>
      {isError && <MediaNotFoundOverlay />}
      <Player source={data} />
    </>
  );
}
