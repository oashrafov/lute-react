import type { Dispatch, SetStateAction } from "react";
import {
  ActionIcon,
  Chip,
  Divider,
  Group,
  Paper,
  Stack,
  Tooltip,
} from "@mantine/core";
import { BookmarksMenu } from "../../../common/BookmarksMenu";
import { BookmarksButton } from "../../../common/BookmarksButton";
import { MarkRestAsKnownButton } from "../../../common/MarkRestAsKnownButton/MarkRestAsKnownButton";
import { useToolbar } from "../../../../hooks/useToolbar";
import type { BookDetail } from "../../../../api/types";
import classes from "./FocusToolbar.module.css";

interface FocusToolbar {
  book: BookDetail;
  showDicts: boolean;
  onShowDicts: Dispatch<SetStateAction<boolean>>;
}

export function FocusToolbar({ book, showDicts, onShowDicts }: FocusToolbar) {
  const toolbarButtons = useToolbar();
  return (
    <Paper shadow="md" withBorder radius={10} p={10}>
      <Stack gap={10}>
        <Group wrap="nowrap" gap={5} justify="center">
          <MarkRestAsKnownButton />
          {book.bookmarks && <BookmarksMenu data={book.bookmarks} />}
          {!book.bookmarks && <BookmarksButton disabled={true} />}
        </Group>

        <Divider />

        <div className={classes.toolbar}>
          {toolbarButtons.map((buttonGrp, index) => (
            <ActionIcon.Group key={index} orientation="horizontal">
              {buttonGrp.map((button) => {
                const Icon = button.icon;
                return (
                  <Tooltip key={button.label} label={button.label}>
                    <ActionIcon
                      p={2}
                      variant="light"
                      onClick={(e) => {
                        e.stopPropagation();
                        button.action();
                      }}>
                      <Icon />
                    </ActionIcon>
                  </Tooltip>
                );
              })}
            </ActionIcon.Group>
          ))}
        </div>

        <Divider />

        <Tooltip label="Show dictionaries for active term" refProp="rootRef">
          <Chip checked={showDicts} onChange={() => onShowDicts((v) => !v)}>
            Show dictionaries
          </Chip>
        </Tooltip>
      </Stack>
    </Paper>
  );
}
