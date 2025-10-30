import { Link } from "@tanstack/react-router";
import { Box, Button, Group, Modal, type ModalProps } from "@mantine/core";
import { IconBook2 } from "@tabler/icons-react";
import { SampleBooksSelect } from "../../features/book/components/common/SampleBooksSelect/SampleBooksSelect";

export function WelcomeModal(props: ModalProps) {
  return (
    <Modal
      trapFocus={false}
      title="Welcome to Lute"
      size="auto"
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      {...props}>
      <Box p={5}>
        <Group wrap="nowrap" mb={10} justify="space-between">
          <span>
            To get started using <strong>Lute</strong> load a short story in
          </span>{" "}
          <SampleBooksSelect placeholder="Predefined language" w={200} />
        </Group>

        <Group wrap="nowrap" justify="center">
          <span>or</span>
          <Button
            leftSection={<IconBook2 />}
            renderRoot={(props) => <Link to="/create-book" {...props} />}>
            Create a New Book
          </Button>
          <span>with your language</span>
        </Group>
      </Box>
    </Modal>
  );
}
