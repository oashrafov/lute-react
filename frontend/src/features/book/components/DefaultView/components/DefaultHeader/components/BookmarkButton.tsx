import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ActionIcon,
  Button,
  Group,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import {
  clearBookmarked,
  getSentence,
  makeBookmarked,
  scrollSentenceIntoView,
} from "../../../../../../../helpers/text";

interface BookmarkButton {
  page: number;
  id: number;
  description: string;
}

export function BookmarkButton({ page, id, description }: BookmarkButton) {
  const navigate = useNavigate();
  const params = useParams();
  const currentPage = Number(params.page);

  const [isEditMode, setEditMode] = useState(false);

  function handleMouseOver() {
    if (page !== currentPage) return;
    makeBookmarked(getSentence(id));
  }

  function handleMouseOut() {
    if (page !== currentPage) return;
    clearBookmarked(getSentence(id));
  }

  function handleViewBookmark() {
    if (page !== currentPage) {
      navigate(`/books/${params.id}/pages/${page}`, {
        state: { id: id },
      });
      return;
    }
    makeBookmarked(scrollSentenceIntoView(id));
  }

  return (
    <Group gap="xs" wrap="nowrap">
      {isEditMode ? (
        <TextInput defaultValue={description} maw={120} size="xs" />
      ) : (
        <Tooltip label={description}>
          <Button
            onClick={handleViewBookmark}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            maw={120}
            variant="outline"
            size="xs">
            <Text fz="xs" lineClamp={1} ta="left">
              {description}
            </Text>
          </Button>
        </Tooltip>
      )}
      <Group gap={2} wrap="nowrap">
        <ActionIcon
          size="xs"
          variant="subtle"
          onClick={() => setEditMode((v) => !v)}>
          {isEditMode ? (
            <IconCheck color="var(--mantine-color-green-6)" />
          ) : (
            <IconEdit />
          )}
        </ActionIcon>
        <ActionIcon size="xs" variant="subtle" color="red.6">
          <IconTrash />
        </ActionIcon>
      </Group>
    </Group>
  );
}
