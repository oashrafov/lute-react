import { createContext, useState } from "react";

const ActiveTermContext = createContext();

function ActiveTermContextProvider({ children }) {
  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });

  return (
    <ActiveTermContext.Provider value={{ activeTerm, setActiveTerm }}>
      {children}
    </ActiveTermContext.Provider>
  );
}

export { ActiveTermContextProvider, ActiveTermContext };
