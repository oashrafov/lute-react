import { useDisclosure } from "@mantine/hooks";
import { createContext } from "react";

const GlobalContext = createContext();

function GlobalContextProvider({ children }) {
  const [
    isMainSideMenuOpen,
    {
      toggle: toggleMainSideMenu,
      close: closeMainSideMenu,
      open: openMainSideMenu,
    },
  ] = useDisclosure(false);

  return (
    <GlobalContext.Provider
      value={{
        mainSideMenu: {
          isOpen: isMainSideMenuOpen,
          toggle: toggleMainSideMenu,
          close: closeMainSideMenu,
          open: openMainSideMenu,
        },
      }}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContextProvider, GlobalContext };
