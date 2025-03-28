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
import { handleTranslate } from "@actions/translation";
import { handleBookmarkSentence } from "@actions/bookmark";
import { textCopied } from "@book/resources/notifications";
import { handleCopy } from "@actions/copy";

export default [
  {
    label: "Translate",
    items: [
      {
        label: "Selection",
        icon: IconClick,
        action: (textitem) => handleTranslate(textitem),
      },
      {
        label: "Sentence",
        icon: IconAlignLeft,
        action: (textitem) => handleTranslate(textitem, "sentence"),
      },
      {
        label: "Paragraph",
        icon: IconPilcrow,
        action: (textitem) => handleTranslate(textitem, "paragraph"),
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
        action: (textitem) => handleTextCopy(textitem),
      },
      {
        label: "Sentence",
        icon: IconClipboardText,
        action: (textitem) => handleTextCopy(textitem, "sentence"),
      },
      {
        label: "Paragraph",
        icon: IconClipboardTypography,
        action: (textitem) => handleTextCopy(textitem, "paragraph"),
      },
      {
        label: "Page",
        icon: IconClipboardTypography,
        action: (textitem) => handleTextCopy(textitem, "page"),
      },
    ],
  },
  {
    label: "",
    items: [
      {
        label: "Bookmark sentence",
        icon: IconBookmarkPlus,
        action: (textitem) => handleBookmarkSentence(textitem),
      },
    ],
  },
];

async function handleTextCopy(textitem, unit = null) {
  const text = await handleCopy(textitem, unit);
  notifications.show(textCopied(text));
}
