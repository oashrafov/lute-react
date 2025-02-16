import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button, Text } from "@mantine/core";
import { initialQuery } from "@settings/api/settings";

function EmptyRow({ tableName, language }) {
  const { data: initial } = useQuery(initialQuery);
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Text component="p" fz="sm" mb={8}>
        No {tableName} found for <strong>{language}</strong>.
      </Text>
      <Button
        component={Link}
        to={`/${tableName}/new?langId=${initial.languageChoices.filter((lang) => lang.name === language)[0].id}`}>
        Create one?
      </Button>
    </div>
  );
}

export default EmptyRow;
