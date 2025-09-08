import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button, Text } from "@mantine/core";
import { queries } from "../../../features/settings/api/queries";

interface EmptyRow {
  tableName: string;
  language: string;
}

export function EmptyRow({ tableName, language }: EmptyRow) {
  const { data: initial } = useQuery(queries.init());
  const langId = initial.languageChoices.filter(
    (lang) => lang.name === language
  )[0].id;
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Text component="p" fz="sm" mb={8}>
        No {tableName} found for <strong>{language}</strong>.
      </Text>
      <Button component={Link} to={`/${tableName}/new?langId=${langId}`}>
        Create one?
      </Button>
    </div>
  );
}
