import { useEffect } from "react";
import { usePlayerContext } from "./usePlayerContext";

export function useSetupPlayer() {
  const { dispatch, audio } = usePlayerContext();

  useEffect(() => {
    function updateTime() {
      dispatch({ type: "timeChanged", payload: audio.currentTime });
    }

    function resetPlayer() {
      dispatch({ type: "durationSet", payload: audio.duration });
      dispatch({ type: "controlsReset" });

      audio.playbackRate = 1.0;
      audio.volume = 1.0;
      audio.pause();
    }

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", resetPlayer);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", resetPlayer);
    };
  }, [audio, dispatch]);
}
