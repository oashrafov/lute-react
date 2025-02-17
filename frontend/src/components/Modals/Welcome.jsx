import { Link } from "react-router-dom";
import { Box, Button, Group } from "@mantine/core";
import { IconBook2 } from "@tabler/icons-react";
import LoadSampleBooksField from "@book/components/common/LoadSampleBooksField/LoadSampleBooksField";

function Welcome() {
  return (
    <Box p={5}>
      <Group wrap="nowrap" mb={10} justify="space-between">
        <span>
          To get started using <strong>Lute</strong> load a short story in
        </span>{" "}
        <LoadSampleBooksField placeholder="Predefined language" width={200} />
      </Group>

      <Group wrap="nowrap" justify="center">
        <span>or</span>
        <Button component={Link} leftSection={<IconBook2 />} to="/books/new">
          Create a New Book
        </Button>
        <span>with your language</span>
      </Group>
    </Box>
  );
}

export default Welcome;
