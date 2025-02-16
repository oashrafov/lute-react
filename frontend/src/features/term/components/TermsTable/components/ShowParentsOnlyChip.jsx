import { Chip } from "@mantine/core";

function ShowParentsOnlyChip({ show, onShow, onSetColumnVisibility }) {
  function handleShowParentsOnly() {
    onSetColumnVisibility((v) => ({
      ...v,
      parentsString: !v.parentsString,
    }));
    onShow((v) => !v);
  }

  return (
    <Chip
      checked={show}
      onChange={handleShowParentsOnly}
      size="xs"
      style={{ alignSelf: "center" }}>
      Show parents only
    </Chip>
  );
}

export default ShowParentsOnlyChip;
