import { useContext } from "react";
import { GlobalContext } from "../store/globalContext";

export function useGlobalContext() {
  return useContext(GlobalContext);
}
