import { Link } from "react-router-dom";
import { Box, Button, Group, Modal } from "@mantine/core";
import { IconBook2 } from "@tabler/icons-react";
import { SampleBooksSelect } from "@book/components/common/SampleBooksSelect/SampleBooksSelect";

export function WelcomeModal({ isOpen }) {
  return (
    <Modal
      trapFocus={false}
      opened={isOpen}
      title="Welcome to Lute"
      size="auto"
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}>
      <Box p={5}>
        <Group wrap="nowrap" mb={10} justify="space-between">
          <span>
            To get started using <strong>Lute</strong> load a short story in
          </span>{" "}
          <SampleBooksSelect placeholder="Predefined language" w={200} />
        </Group>

        <Group wrap="nowrap" justify="center">
          <span>or</span>
          <Button component={Link} leftSection={<IconBook2 />} to="/books/new">
            Create a New Book
          </Button>
          <span>with your language</span>
        </Group>
      </Box>
    </Modal>
  );
}
