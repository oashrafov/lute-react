import { Pill, PillGroup } from "@mantine/core";
import classes from "./TagsGroup.module.css";

function TagsGroup({ tags }) {
  return (
    <PillGroup gap={4}>
      {tags.map((tag) => (
        <Pill
          key={tag}
          classNames={{
            root: classes.pill,
          }}>
          {tag}
        </Pill>
      ))}
    </PillGroup>
  );
}

export default TagsGroup;
