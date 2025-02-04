import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, rem, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import { databaseCleaned, demoDeactivated } from "@resources/notifications";
import { keys as bookKeys } from "@book/api/keys";
import { keys as settingsKeys } from "@settings/api/keys";
import { deactivateDemoMode, wipeDemoDatabase } from "@settings/api/api";

function DemoNotice({ tutorialBookId }) {
  const queryClient = useQueryClient();

  const wipeDbMutation = useMutation({
    mutationFn: wipeDemoDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.books });
      queryClient.invalidateQueries({ queryKey: settingsKeys.initial });
      notifications.show(databaseCleaned);
    },
  });

  const deactivateDemoMutation = useMutation({
    mutationFn: deactivateDemoMode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.initial });
      notifications.show(demoDeactivated);
    },
  });

  return (
    <Alert
      styles={{ wrapper: { alignItems: "center" }, body: { gap: rem(5) } }}
      variant="light"
      color="green"
      title="Demo material"
      icon={<IconInfoCircle />}>
      <Text size="sm">
        The Lute database has been loaded with a{" "}
        <Link to={`/books/${tutorialBookId}/pages/1`}>brief tutorial</Link>,
        some languages and short texts for you to try out. When you&apos;re done
        trying out the demo,{" "}
        <Button
          p={0}
          styles={{ root: { verticalAlign: "unset" } }}
          onClick={wipeDbMutation.mutate}
          size="compact-sm"
          variant="transparent"
          fw="normal">
          clear out the database
        </Button>{" "}
        <em>(this removes everything in the db)</em>. Or instead,{" "}
        <Button
          p={0}
          styles={{ root: { verticalAlign: "unset" } }}
          onClick={deactivateDemoMutation.mutate}
          size="compact-sm"
          variant="transparent"
          fw="normal">
          dismiss this message.
        </Button>
      </Text>
    </Alert>
  );
}

export default DemoNotice;
