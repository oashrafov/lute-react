import { Pill, PillGroup } from "@mantine/core";
import classes from "../TermsTable.module.css";

function PillCell({ tagsList }) {
  return (
    <PillGroup gap={4}>
      {tagsList.map((tag) => (
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

export default PillCell;
