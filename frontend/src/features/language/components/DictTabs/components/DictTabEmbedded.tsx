import { Text } from "@mantine/core";
import { DictFavicon } from "./common/DictFavicon";
import type { ElementType } from "react";
import type { Dictionary } from "../../../api/types";
import classes from "../DictTabs.module.css";

interface DictTabEmbedded {
  dict: Dictionary;
  value: string;
  innerRef?: React.ForwardedRef<HTMLElement>;
  onClick: () => void;
  component: ElementType;
}

export function DictTabEmbedded({
  dict,
  value,
  innerRef,
  onClick,
  component: Component,
}: DictTabEmbedded) {
  return (
    <Component
      className={classes.flex}
      ref={innerRef}
      id={value}
      value={value}
      onClick={onClick}
      leftSection={<DictFavicon hostname={dict.hostname} />}>
      <Text size="sm" style={{ overflow: "hidden" }}>
        {dict.label}
      </Text>
    </Component>
  );
}
