import { Group, Text, Tooltip } from "@mantine/core";
import { TagsGroup } from "../../../../../../components/common/TagsGroup/TagsGroup";
import { PopupDataSection } from "./PopupDataSection";
import type { TermPopup } from "../../../../api/types";
import { BACKEND_URL } from "../../../../../../resources/constants";
import classes from "./PopupData.module.css";

export function PopupData({ data }: { data: TermPopup }) {
  return (
    <div className={classes.container}>
      <Group gap={5} wrap="nowrap">
        <span className={classes.term}>{data.text}</span>
        {data.tags.length > 0 && <TagsGroup tags={data.tags} />}
      </Group>

      {data.pronunciation && <em>{data.pronunciation}</em>}

      {Object.entries(data.images).map(([img, tooltip]) => (
        <Tooltip key={img} label={tooltip}>
          <img className={classes.image} src={`${BACKEND_URL}${img}`} />
        </Tooltip>
      ))}

      {data.translation && (
        <p
          className={classes.translation}
          dangerouslySetInnerHTML={{
            __html: data.translation,
          }}
        />
      )}

      {data.parents.length > 0 && <PopupDataSection data={data.parents} />}

      {data.components.length > 0 && (
        <>
          <Text component="p" mt="sm" fs="italic">
            Components
          </Text>
          <PopupDataSection data={data.components} />
        </>
      )}
    </div>
  );
}
