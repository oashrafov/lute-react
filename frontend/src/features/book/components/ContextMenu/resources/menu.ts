import { notifications } from "@mantine/notifications";
import {
  IconClick,
  IconAlignLeft,
  IconPilcrow,
  IconClipboardCheck,
  IconClipboardText,
  IconClipboardTypography,
  IconBookmarkPlus,
} from "@tabler/icons-react";
import { handleTranslate } from "../../../../../helpers/translation";
import { handleBookmarkSentence } from "../../../../../helpers/bookmark";
import { textCopied } from "../../../resources/notifications";
import { handleCopy } from "../../../../../helpers/copy";
import type { TextitemElement, TextUnit } from "../../../../../resources/types";

export const menu = [
  {
    label: "Translate",
    items: [
      {
        label: "Selection",
        icon: IconClick,
        action: (textitem: TextitemElement) => handleTranslate(textitem),
      },
      {
        label: "Sentence",
        icon: IconAlignLeft,
        action: (textitem: TextitemElement) =>
          handleTranslate(textitem, "sentence"),
      },
      {
        label: "Paragraph",
        icon: IconPilcrow,
        action: (textitem: TextitemElement) =>
          handleTranslate(textitem, "paragraph"),
      },
    ],
  },
  {
    label: "Copy",
    items: [
      {
        label: "Selection",
        icon: IconClipboardCheck,
        // !FIX have changed handleCopy in the actions file. fix
        action: async (textitem: TextitemElement) => handleTextCopy(textitem),
      },
      {
        label: "Sentence",
        icon: IconClipboardText,
        action: async (textitem: TextitemElement) =>
          handleTextCopy(textitem, "sentence"),
      },
      {
        label: "Paragraph",
        icon: IconClipboardTypography,
        action: async (textitem: TextitemElement) =>
          handleTextCopy(textitem, "paragraph"),
      },
      {
        label: "Page",
        icon: IconClipboardTypography,
        action: async (textitem: TextitemElement) =>
          handleTextCopy(textitem, "page"),
      },
    ],
  },
  {
    label: "",
    items: [
      {
        label: "Bookmark sentence",
        icon: IconBookmarkPlus,
        action: (textitem: TextitemElement) => handleBookmarkSentence(textitem),
      },
    ],
  },
];

async function handleTextCopy(textitem: TextitemElement, unit?: TextUnit) {
  const text = await handleCopy(textitem, unit);
  notifications.show(textCopied(text));
}
