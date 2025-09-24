import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { TextitemElement } from "../../../resources/types";

interface SingleTerm {
  data: number;
  type: "single";
  textitems: TextitemElement[];
}

interface MultiTerm {
  data: string;
  type: "multi";
  langId: number;
  textitems: TextitemElement[];
}

interface SelectedTerm {
  data: number[];
  type: "select";
  textitems: TextitemElement[];
}

interface CopiedTerm {
  data: string;
  type: "copy";
}

interface NoTerm {
  data: null;
  type?: null;
}

export type ActiveTerm =
  | SingleTerm
  | MultiTerm
  | SelectedTerm
  | CopiedTerm
  | NoTerm
  | null;

interface ActiveTermContextValue {
  activeTerm: ActiveTerm;
  setActiveTerm: Dispatch<SetStateAction<ActiveTerm>>;
}

const ActiveTermContext = createContext<ActiveTermContextValue | null>(null);

function ActiveTermContextProvider({ children }: { children: ReactNode }) {
  const [activeTerm, setActiveTerm] = useState<ActiveTerm>(null);

  return (
    <ActiveTermContext.Provider value={{ activeTerm, setActiveTerm }}>
      {children}
    </ActiveTermContext.Provider>
  );
}

export { ActiveTermContextProvider, ActiveTermContext };
