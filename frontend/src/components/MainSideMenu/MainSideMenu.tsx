import { DrawerMenu } from "../DrawerMenu/DrawerMenu";
import { useGlobalContext } from "../../hooks/useGlobalContext";

export function MainSideMenu() {
  const { mainSideMenu } = useGlobalContext();
  return (
    <DrawerMenu isOpen={mainSideMenu.isOpen} onClose={mainSideMenu.close}>
      placeholder
    </DrawerMenu>
  );
}
