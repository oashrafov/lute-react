import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Player } from "./Player/Player";
import { MediaNotFoundOverlay } from "./Player/components/MediaNotFoundOverlay/MediaNotFoundOverlay";
import { errorMessage } from "../../../../resources/notifications";
import { queries } from "../../api/queries";
import { AudioDataProvider } from "./Player/store/audioDataContext";
import { getRouteApi } from "@tanstack/react-router";

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
      <AudioDataProvider>
        {isError && <MediaNotFoundOverlay />}
        <Player source={data} />
      </AudioDataProvider>
    </>
  );
}
