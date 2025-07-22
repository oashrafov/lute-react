import { useState } from "react";
import { Link } from "react-router-dom";
import { ActionIcon, Button, Group, Popover } from "@mantine/core";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { SampleBooksSelect } from "@book/components/common/SampleBooksSelect/SampleBooksSelect";
import classes from "../BooksTable.module.css";

export function BookActions({ table }) {
  const [opened, setOpened] = useState(false);

  function handleLoadBooks(langName) {
    table.setColumnFilters([{ id: "language", value: langName }]);
  }

  function handleConfirmSelect() {
    setOpened(false);
  }

  function handleTogglePopup() {
    setOpened((v) => !v);
  }

  return (
    <Group gap={0} wrap="nowrap">
      <Button
        color="green"
        size="xs"
        component={Link}
        to="/books/new"
        leftSection={<IconPlus size={22} />}
        className={classes.button}>
        New
      </Button>
      <Popover shadow="md" opened={opened} onChange={setOpened}>
        <Popover.Target>
          <ActionIcon
            color="green"
            onClick={handleTogglePopup}
            size={30}
            className={classes.menu}>
            <IconChevronDown stroke={1.5} size={20} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown p={10}>
          <SampleBooksSelect
            label="Load sample books"
            description="Load predefined language sample books"
            placeholder="e.g Arabic"
            onSuccess={handleLoadBooks}
            onConfirm={handleConfirmSelect}
          />
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
