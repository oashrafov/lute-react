import { Text } from "@mantine/core";
import {
  IconBookOff,
  IconClipboardCheck,
  IconPencilCheck,
} from "@tabler/icons-react";

const notificationsDefault = {
  position: "bottom-right",
  autoClose: 3000,
  withCloseButton: false,
  withBorder: true,
  color: "green",
};

const bookDeleted = (message) => ({
  ...notificationsDefault,
  title: "Book deleted",
  message: (
    <Text component="p" lineClamp={2} fz="xs">
      {message}
    </Text>
  ),
  icon: <IconBookOff />,
  color: "red",
});

const bookUpdated = (message) => ({
  ...notificationsDefault,
  title: "Book updated",
  message: (
    <Text component="p" lineClamp={2} fz="xs">
      {message}
    </Text>
  ),
  icon: <IconPencilCheck />,
});

const sampleBooksAdded = (message) => ({
  ...notificationsDefault,
  title: "Book(s) added",
  message: (
    <Text component="p" lineClamp={2} fz="xs">
      {message}
    </Text>
  ),
  icon: <IconPencilCheck />,
});

const textCopied = (message) => ({
  ...notificationsDefault,
  title: "Selection copied to clipboard!",
  message: (
    <Text component="p" lineClamp={2} fz="xs">
      {message}
    </Text>
  ),
  icon: <IconClipboardCheck />,
});

export { bookDeleted, bookUpdated, sampleBooksAdded, textCopied };
