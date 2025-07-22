import { useBookContext } from "@book/hooks/useBookContext";
import { Divider } from "@mantine/core";
import { DrawerFooter } from "../../../../components/DrawerMenu/components/DrawerFooter";
import { Actions } from "../../../../components/DrawerMenu/components/Actions/Actions";
import { Section } from "../../../../components/DrawerMenu/components/Section/Section";
import { DrawerMenu } from "../../../../components/DrawerMenu/DrawerMenu";

export function SideMenu() {
  const { drawer } = useBookContext();
  return (
    <DrawerMenu isOpen={drawer.isOpen} onClose={drawer.close}>
      <Actions />
      <Section />
      <Divider />
      <DrawerFooter />
    </DrawerMenu>
  );
}
