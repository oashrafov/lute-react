import { useContext } from "react";
import { PlayerContext } from "../store/playerContext";

export function usePlayerContext() {
  return useContext(PlayerContext);
}
