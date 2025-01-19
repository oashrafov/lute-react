import { Link } from "react-router-dom";
import { Button, Text } from "@mantine/core";

function EmptyRow({ tableName, language, languageChoices }) {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Text component="p" fz="sm" mb={8}>
        No {tableName} found for <strong>{language}</strong>.
      </Text>
      <Button
        component={Link}
        to={`/${tableName}/new?langId=${languageChoices.filter((lang) => lang.name === language)[0].id}`}>
        Create one?
      </Button>
    </div>
  );
}

export default EmptyRow;
