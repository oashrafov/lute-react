import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { getFromLocalStorage } from "../../../utils/utils";

export type View = "default" | "focus" | "edit";

interface ViewValue {
  view: View;
  setView: Dispatch<SetStateAction<View>>;
}

const ViewContext = createContext<ViewValue | null>(null);

function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>(() =>
    getFromLocalStorage("Lute.view", "default")
  );

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

export { ViewProvider, ViewContext };
