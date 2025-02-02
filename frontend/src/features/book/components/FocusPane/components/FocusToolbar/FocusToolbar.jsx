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
import BookmarksMenu from "../../../common/BookmarksMenu";
import BookmarksButton from "../../../common/BookmarksButton";
import MarkRestAsKnownButton from "../../../common/MarkRestAsKnownButton/MarkRestAsKnownButton";
import getToolbarButtons from "../../../ReadPane/components/Toolbar/toolbarButtons";

function FocusToolbar({
  book,
  focusMode,
  state,
  dispatch,
  showDicts,
  onShowDicts,
}) {
  const toolbarButtons = getToolbarButtons(state, dispatch);
  return (
    <Affix position={{ top: 90, left: 20 }} zIndex={199}>
      <Transition transition="slide-right" mounted={focusMode}>
        {(styles) => (
          <Paper shadow="md" withBorder radius={10} p={10} style={styles}>
            <Stack gap={10}>
              <Group wrap="nowrap" gap={5} justify="space-evenly">
                {/* <Divider orientation="vertical" /> */}

                <Group gap={5}>
                  <MarkRestAsKnownButton />
                  {book.bookmarks && <BookmarksMenu data={book.bookmarks} />}
                  {!book.bookmarks && <BookmarksButton disabled={true} />}
                </Group>
              </Group>

              <Divider />

              <Group justify="center">
                <Stack gap={5}>
                  {toolbarButtons.slice(0, 2).map((buttonGrp, index) => (
                    <Group key={index} justify="center">
                      <ActionIcon.Group orientation="horizontal">
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
                    </Group>
                  ))}
                </Stack>
                <Stack gap={5}>
                  {toolbarButtons.slice(2).map((buttonGrp, index) => (
                    <Group key={index} justify="center">
                      <ActionIcon.Group orientation="horizontal">
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
                    </Group>
                  ))}
                </Stack>
              </Group>

              <Divider />

              <Group gap={5}>
                <Tooltip
                  label="Show dictionaries for active term"
                  refProp="rootRef">
                  <Chip
                    checked={showDicts}
                    onChange={() => onShowDicts((v) => !v)}>
                    Show dictionaries
                  </Chip>
                </Tooltip>
              </Group>
            </Stack>
          </Paper>
        )}
      </Transition>
    </Affix>
  );
}

export default FocusToolbar;
