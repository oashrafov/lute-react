import {
  ActionIcon,
  Affix,
  Chip,
  Divider,
  Group,
  Paper,
  Stack,
  Tooltip,
  Transition,
} from "@mantine/core";
import BookmarksMenu from "@book/components/common/BookmarksMenu";
import BookmarksButton from "@book/components/common/BookmarksButton";
import MarkRestAsKnownButton from "@book/components/common/MarkRestAsKnownButton/MarkRestAsKnownButton";
import getToolbarButtons from "@book/components/ReadPane/components/Toolbar/toolbarButtons";
import classes from "../../FocusPane.module.css";

function FocusToolbar({ book, show, state, dispatch, showDicts, onShowDicts }) {
  return (
    <Affix position={{ top: 100, left: 20 }} zIndex={199}>
      <Transition transition="slide-right" mounted={show}>
        {(styles) => (
          <Paper shadow="md" withBorder radius={10} p={10} style={styles}>
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

              <Tooltip
                label="Show dictionaries for active term"
                refProp="rootRef">
                <Chip
                  checked={showDicts}
                  onChange={() => onShowDicts((v) => !v)}>
                  Show dictionaries
                </Chip>
              </Tooltip>
            </Stack>
          </Paper>
        )}
      </Transition>
    </Affix>
  );
}

export default FocusToolbar;
