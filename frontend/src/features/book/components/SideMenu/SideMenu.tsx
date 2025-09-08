import { useBookContext } from "../../hooks/useBookContext";
import { Divider } from "@mantine/core";
import { DrawerFooter } from "../../../../components/DrawerMenu/components/DrawerFooter";
import { Actions } from "../../../../components/DrawerMenu/components/Actions/Actions";
import { SegmentedSection } from "../../../../components/DrawerMenu/components/SegmentedSection/SegmentedSection";
import { DrawerMenu } from "../../../../components/DrawerMenu/DrawerMenu";

export function SideMenu() {
  const { drawer } = useBookContext();
  return (
    <DrawerMenu isOpen={drawer.isOpen} onClose={drawer.close}>
      <Actions />
      <SegmentedSection />
      <Divider />
      <DrawerFooter />
    </DrawerMenu>
  );
}
