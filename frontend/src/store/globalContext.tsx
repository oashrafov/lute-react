import { useDisclosure } from "@mantine/hooks";
import { createContext, type ReactNode } from "react";

interface GlobalContextValue {
  mainSideMenu: {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
    open: () => void;
  };
}

const GlobalContext = createContext<GlobalContextValue | null>(null);

function GlobalContextProvider({ children }: { children: ReactNode }) {
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
