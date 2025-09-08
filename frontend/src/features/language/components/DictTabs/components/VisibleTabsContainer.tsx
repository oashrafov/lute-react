import { Children, type ReactNode } from "react";

export function VisibleTabsContainer({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: `repeat(${Children.toArray(children).length}, minmax(3rem, 8rem))`,
      }}>
      {children}
    </div>
  );
}
