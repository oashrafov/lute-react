import { rem, Text } from "@mantine/core";

const softwareInfo = {
  modal: "about",
  title: "About Lute",
  styles: {
    title: { fontWeight: 500 },
    content: { overflow: "unset", padding: rem(8) },
    body: { width: "max-content" },
  },
};

const deleteBookConfirm = (name, onConfirm) => ({
  title: "Delete term",
  children: (
    <Text size="sm">
      Are you sure you want to delete{" "}
      <Text component="span" fw="bold">
        {`"${name}"`}
      </Text>
    </Text>
  ),
  labels: { confirm: "Delete", cancel: "Cancel" },
  confirmProps: { color: "red" },
  onConfirm: onConfirm,
});

export { softwareInfo, deleteBookConfirm };
