import { Affix, Transition } from "@mantine/core";

export function FloatingContainer({
  show,
  duration = 250,
  transition = "fade",
  children,
  ...props
}) {
  return (
    <Affix position={{ top: 0, left: 0 }} zIndex={199} {...props}>
      <Transition
        transition={transition}
        mounted={show}
        duration={duration}
        keepMounted>
        {(styles) => <div style={styles}>{children}</div>}
      </Transition>
    </Affix>
  );
}
