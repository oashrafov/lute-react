import { IconPencilCancel, IconPencilCheck } from "@tabler/icons-react";

const notificationsDefault = {
  position: "bottom-right",
  autoClose: 3000,
  withCloseButton: false,
  withBorder: true,
};

const termDeleted = {
  ...notificationsDefault,
  title: "Term deleted",
  icon: <IconPencilCancel />,
  color: "red",
};

const termUpdated = {
  ...notificationsDefault,
  title: "Term updated",
  icon: <IconPencilCheck />,
  color: "green.6",
};

const termCreated = {
  ...notificationsDefault,
  title: "Term created",
  icon: <IconPencilCheck />,
  color: "green.6",
};

export { termUpdated, termCreated, termDeleted };
