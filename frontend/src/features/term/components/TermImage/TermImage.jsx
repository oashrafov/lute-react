import { Popover, UnstyledButton, Image } from "@mantine/core";

function TermImage({ src, position = "left" }) {
  return (
    <Popover position={position}>
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

export default TermImage;
