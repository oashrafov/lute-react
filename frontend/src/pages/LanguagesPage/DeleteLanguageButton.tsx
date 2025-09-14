import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { modals } from "@mantine/modals";
import { IconSquareRoundedMinusFilled } from "@tabler/icons-react";
import { deleteLanguageConfirm } from "../../resources/modals";
import { queries } from "../../features/settings/api/queries";

export function DeleteLanguageButton() {
  const { t } = useTranslation("page", { keyPrefix: "languages" });
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const { data: initial } = useQuery(queries.init());
  const selectedLangName = initial?.languageChoices.filter(
    (lang) => lang.id === Number(langId)
  )[0]?.name;
  return (
    <Tooltip label={t("deleteLangLabel")}>
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
