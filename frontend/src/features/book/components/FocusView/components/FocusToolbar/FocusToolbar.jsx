import {
  ActionIcon,
  Chip,
  Divider,
  Group,
  Paper,
  Stack,
  Tooltip,
} from "@mantine/core";
import { BookmarksMenu } from "@book/components/common/BookmarksMenu";
import { BookmarksButton } from "@book/components/common/BookmarksButton";
import { MarkRestAsKnownButton } from "@book/components/common/MarkRestAsKnownButton/MarkRestAsKnownButton";
import { getToolbarButtons } from "@book/components/DefaultView/components/Toolbar/toolbarButtons";
import { usePageContext } from "@book/hooks/usePageContext";
import classes from "./FocusToolbar.module.css";

export function FocusToolbar({ book, showDicts, onShowDicts }) {
  const { state, dispatch } = usePageContext();
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
          {getToolbarButtons(state, dispatch).map((buttonGrp, index) => (
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
