import { createContext } from "react";
import { useDisclosure } from "@mantine/hooks";

const BookContext = createContext();

function BookContextProvider({ children }) {
  const [
    isDrawerOpen,
    { toggle: toggleDrawer, close: closeDrawer, open: openDrawer },
  ] = useDisclosure(false);
  const [
    isThemeFormOpen,
    { toggle: toggleThemeForm, close: closeThemeForm, open: openThemeForm },
  ] = useDisclosure(false);

  return (
    <BookContext.Provider
      value={{
        drawer: {
          isOpen: isDrawerOpen,
          toggle: toggleDrawer,
          close: closeDrawer,
          open: openDrawer,
        },
        themeForm: {
          isOpen: isThemeFormOpen,
          toggle: toggleThemeForm,
          close: closeThemeForm,
          open: openThemeForm,
        },
      }}>
      {children}
    </BookContext.Provider>
  );
}

export { BookContextProvider, BookContext };
