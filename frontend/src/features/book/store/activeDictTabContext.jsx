import { createContext, useState } from "react";

const ActiveDictTabContext = createContext();

function ActiveDictTabProvider({ children }) {
  const [activeDictTab, setActiveDictTab] = useState("0");

  return (
    <ActiveDictTabContext.Provider value={{ activeDictTab, setActiveDictTab }}>
      {children}
    </ActiveDictTabContext.Provider>
  );
}

export { ActiveDictTabProvider, ActiveDictTabContext };
