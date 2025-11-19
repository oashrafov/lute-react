import { Group } from "@mantine/core";
import { TagsGroup } from "#common/TagsGroup/TagsGroup";
import type { TermPopupSection } from "#term/api/types";
import classes from "./PopupData.module.css";

export function PopupDataSection({ data }: { data: TermPopupSection[] }) {
  return data.map((d, index) => (
    <div key={index} className={classes.section}>
      <Group gap={5} wrap="nowrap">
        <span
          className={classes.term}
          dangerouslySetInnerHTML={{
            __html: d.text,
          }}
        />
        {d.pronunciation && <em>({d.pronunciation})</em>}
        {d.tags.length > 0 && <TagsGroup tags={d.tags} />}
      </Group>
      {d.translation && (
        <span
          dangerouslySetInnerHTML={{
            __html: d.translation,
          }}
        />
      )}
    </div>
  ));
}
