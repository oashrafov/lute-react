import { Fragment, memo, useState } from "react";
import { ActionIcon, Divider, Group, Paper, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import getToolbarButtons from "./toolbarButtons";
import classes from "./Toolbar.module.css";

function Toolbar({ state, dispatch }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  const toolbarButtons = getToolbarButtons(state, dispatch).slice(0, -1);

  return (
    <Paper
      ref={ref}
      shadow="sm"
      withBorder
      style={{ translate: open ? "0 100%" : "0 5px" }}
      className={classes.toolbar}
      classNames={{ root: "readpage" }}
      onClick={() => setOpen((v) => !v)}>
      <Group wrap="no-wrap" gap={5} align="center" justify="center">
        {toolbarButtons.map((buttonGrp, index) => (
          <Fragment key={index}>
            <ActionIcon.Group orientation="horizontal">
              {buttonGrp.map((button) => {
                const Icon = button.icon;
                return (
                  <Tooltip key={button.label} label={button.label}>
                    <ActionIcon
                      p={2}
                      size="sm"
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

            {index !== toolbarButtons.length - 1 && (
              <Divider size="xs" orientation="vertical" />
            )}
          </Fragment>
        ))}
      </Group>
    </Paper>
  );
}

export default memo(Toolbar);
