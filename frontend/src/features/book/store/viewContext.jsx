import { createContext, useState } from "react";
import { getFromLocalStorage } from "@actions/utils";

const ViewContext = createContext();

function ViewProvider({ children }) {
  const [view, setView] = useState(() =>
    getFromLocalStorage("Lute.view", "default")
  ); // default | focus | edit

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

export { ViewProvider, ViewContext };
