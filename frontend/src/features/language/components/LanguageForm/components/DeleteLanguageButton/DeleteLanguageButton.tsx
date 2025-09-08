import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ActionIcon, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconSquareRoundedMinusFilled } from "@tabler/icons-react";
import { deleteLanguageConfirm } from "../../../../../../resources/modals";
import { queries } from "../../../../../settings/api/queries";

export function DeleteLanguageButton() {
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const { data: initial } = useQuery(queries.init());
  const selectedLangName = initial?.languageChoices.filter(
    (lang) => lang.id === Number(langId)
  )[0]?.name;

  return (
    <Tooltip label="Delete selected language">
      <ActionIcon
        variant="transparent"
        color="red"
        onClick={() =>
          selectedLangName &&
          modals.openConfirmModal(
            deleteLanguageConfirm(selectedLangName, () => {})
          )
        }
        size="sm"
        style={{ backgroundColor: "transparent" }}
        disabled={!selectedLangName}>
        <IconSquareRoundedMinusFilled />
      </ActionIcon>
    </Tooltip>
  );
}
