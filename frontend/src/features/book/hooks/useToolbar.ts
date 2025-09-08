import {
  IconBaselineDensityMedium,
  IconBaselineDensitySmall,
  IconColumns1,
  IconColumns2,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightExpand,
  IconTextDecrease,
  IconTextIncrease,
} from "@tabler/icons-react";
import {
  handleSetColumnCount,
  handleSetFontSize,
  handleSetLineHeight,
  handleSetTextWidth,
} from "../../../helpers/page";
import { usePageContext } from "./usePageContext";

export function useToolbar() {
  const { state, dispatch } = usePageContext();
  return [
    [
      {
        label: "Descrease font size",
        icon: IconTextDecrease,
        action: () => handleSetFontSize(state.fontSize - 0.1, dispatch),
      },
      {
        label: "Increase font size",
        icon: IconTextIncrease,
        action: () => handleSetFontSize(state.fontSize + 0.1, dispatch),
      },
    ],
    [
      {
        label: "Descrease line height",
        icon: IconBaselineDensityMedium,
        action: () => handleSetLineHeight(state.lineHeight - 1, dispatch),
      },
      {
        label: "Increase line height",
        icon: IconBaselineDensitySmall,
        action: () => handleSetLineHeight(state.lineHeight + 1, dispatch),
      },
    ],
    [
      {
        label: "Set columns to 1",
        icon: IconColumns1,
        action: () => handleSetColumnCount(1, dispatch),
      },
      {
        label: "Set columns to 2",
        icon: IconColumns2,
        action: () => handleSetColumnCount(2, dispatch),
      },
    ],
    [
      {
        label: "Decrease text width",
        icon: IconLayoutSidebarRightExpand,
        action: () => handleSetTextWidth(state.textWidth * 0.95, dispatch),
      },
      {
        label: "Increase text width",
        icon: IconLayoutSidebarLeftExpand,
        action: () => handleSetTextWidth(state.textWidth * 1.05, dispatch),
      },
    ],
  ];
}
