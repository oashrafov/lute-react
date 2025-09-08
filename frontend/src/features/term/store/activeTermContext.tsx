import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { TextItemElement } from "../../../resources/types";

interface SingleTerm {
  data: number;
  type: "single";
  textitems: TextItemElement[];
}

interface MultiTerm {
  data: string;
  type: "multi";
  langId: number;
  textitems: TextItemElement[];
}

interface SelectedTerm {
  data: number[];
  type: "select";
  textitems: TextItemElement[];
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
