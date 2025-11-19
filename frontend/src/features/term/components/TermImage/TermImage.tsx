import {
  Popover,
  UnstyledButton,
  Image,
  type ImageProps,
  type PopoverProps,
} from "@mantine/core";

interface TermImage extends PopoverProps {
  src: ImageProps["src"];
}

export function TermImage({ src, ...props }: TermImage) {
  return (
    <Popover position="left" {...props}>
      <Popover.Target>
        <UnstyledButton display="block">
          <Image radius={5} w={50} h={50} src={src} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Image radius={5} mah="200px" src={src} />
      </Popover.Dropdown>
    </Popover>
  );
}
