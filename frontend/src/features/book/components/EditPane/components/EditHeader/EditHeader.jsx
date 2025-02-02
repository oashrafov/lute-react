import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconFileArrowLeft,
  IconFileArrowRight,
  IconFileCheck,
  IconFileOff,
  IconFileXFilled,
} from "@tabler/icons-react";

function EditHeader({ book, page, onSetEdit }) {
  function handleAddBefore() {}
  function handleAddAfter() {}
  function handleDelete() {}
  function handleSave() {
    onSetEdit({ edit: "false" });
  }

  return (
    <Paper
      withBorder={false}
      radius={0}
      shadow="sm"
      style={{ padding: "1rem 2rem" }}
      classNames={{ root: "readpage" }}>
      <Group justify="space-between" wrap="nowrap" mb={10}>
        <span>
          Editing:{" "}
          <Text
            display="inline"
            component="h1"
            fw={500}
            fz="inherit"
            lineClamp={1}>
            {book.title}
          </Text>
        </span>
        <Group gap={2} wrap="nowrap">
          <Text
            component="span"
            fw={500}
            fz="inherit"
            style={{ whiteSpace: "nowrap" }}>
            page: {page}
          </Text>
          <Tooltip label="Delete this page" position="right">
            <ActionIcon
              size="sm"
              variant="transparent"
              color="red"
              onClick={handleDelete}>
              <IconFileXFilled />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      <Group gap="xs" justify="space-between" wrap="nowrap">
        <Button
          onClick={handleAddBefore}
          size="xs"
          leftSection={<IconFileArrowLeft />}>
          Add page before
        </Button>
        <Stack gap={5}>
          <Group gap={5} justify="center" wrap="nowrap">
            <Button
              color="green"
              onClick={handleSave}
              size="xs"
              leftSection={<IconFileCheck />}>
              Save
            </Button>
            <Button
              onClick={() => onSetEdit({ edit: "false" })}
              size="xs"
              leftSection={<IconFileOff />}>
              Cancel
            </Button>
          </Group>
        </Stack>
        <Button
          onClick={handleAddAfter}
          size="xs"
          rightSection={<IconFileArrowRight />}>
          Add page after
        </Button>
      </Group>
    </Paper>
  );
}

export default EditHeader;
