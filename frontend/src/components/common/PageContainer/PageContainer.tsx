import type { HTMLProps, ReactNode } from "react";
import classes from "./PageContainer.module.css";

interface PageContainer extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
}

export function PageContainer({ children, ...props }: PageContainer) {
  return (
    <div className={classes.container} style={{ width: "100%", ...props }}>
      {children}
    </div>
  );
}
