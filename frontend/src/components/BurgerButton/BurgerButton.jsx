import { useGlobalContext } from "@hooks/useGlobalContext";
import { Burger } from "@mantine/core";

export function BurgerButton({ ...props }) {
  const { mainSideMenu } = useGlobalContext();
  return (
    <Burger
      opened={mainSideMenu.isOpen}
      onClick={mainSideMenu.toggle}
      size="sm"
      {...props}
    />
  );
}
