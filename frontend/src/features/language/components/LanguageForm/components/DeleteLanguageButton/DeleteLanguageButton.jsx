import { useQuery } from "@tanstack/react-query";
import { ActionIcon, Paper, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { initialQuery } from "@settings/api/settings";
import { IconSquareRoundedMinusFilled } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";

export function DeleteLanguageButton() {
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const { data: initial } = useQuery(initialQuery);
  const selectedLangName = initial.languageChoices.filter(
    (lang) => lang.id === Number(langId)
  )[0]?.name;

  return (
    <Tooltip label="Delete selected language">
      <ActionIcon
        variant="transparent"
        color="red"
        onClick={() =>
          modals.openConfirmModal({
            title: "Delete language",
            children: (
              <>
                <Paper p="lg">
                  <Text>
                    <strong>WARNING:</strong> deleting a language deletes all
                    its books and defined terms!
                  </Text>
                </Paper>
                <Text size="sm" mt={10}>
                  Are you sure you want to delete{" "}
                  <Text component="span" fw="bold">
                    {`"${selectedLangName}"`}
                  </Text>{" "}
                  ?
                </Text>
              </>
            ),
            labels: { confirm: "Delete", cancel: "Cancel" },
            confirmProps: { color: "red" },
            // onConfirm: handleDelete,
          })
        }
        size="sm"
        style={{ backgroundColor: "transparent" }}
        disabled={!selectedLangName}>
        <IconSquareRoundedMinusFilled />
      </ActionIcon>
    </Tooltip>
  );
}
