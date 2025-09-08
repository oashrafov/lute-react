import { Link } from "react-router-dom";
import classes from "../DrawerMenu.module.css";

interface MenuItem {
  item: { label: string; action: string };
}

export function MenuLink({ item }: MenuItem) {
  return (
    <Link key={item.label} className={classes.link} to={item.action}>
      {item.label}
    </Link>
  );
}
