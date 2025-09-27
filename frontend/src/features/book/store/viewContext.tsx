import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { getFromLocalStorage } from "../../../utils/utils";
import type { LocalStorageItem } from "../../../resources/types";

export type View = "default" | "focus" | "edit";

interface ViewValue {
  view: View;
  setView: Dispatch<SetStateAction<View>>;
}

const ViewContext = createContext<ViewValue | null>(null);

function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>(() =>
    getFromLocalStorage<LocalStorageItem>("Lute.view", "default")
  );

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

export { ViewProvider, ViewContext };
