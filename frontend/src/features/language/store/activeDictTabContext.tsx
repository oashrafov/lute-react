import {
  useState,
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface ActiveDictTabValue {
  activeDictTab: string;
  setActiveDictTab: Dispatch<SetStateAction<string>>;
}

const ActiveDictTabContext = createContext<ActiveDictTabValue | null>(null);

function ActiveDictTabProvider({ children }: { children: ReactNode }) {
  const [activeDictTab, setActiveDictTab] = useState<string>("0");

  return (
    <ActiveDictTabContext.Provider value={{ activeDictTab, setActiveDictTab }}>
      {children}
    </ActiveDictTabContext.Provider>
  );
}

export { ActiveDictTabProvider, ActiveDictTabContext };
