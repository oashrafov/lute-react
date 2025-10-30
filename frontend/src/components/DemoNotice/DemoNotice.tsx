import { Alert, Button, rem, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { IconInfoCircle } from "@tabler/icons-react";
import {
  useDeactivateDemoMode,
  useWipeDatabase,
} from "../../features/settings/api/mutation";

interface DemoNotice {
  tutorialBookId: number;
}

export function DemoNotice({ tutorialBookId }: DemoNotice) {
  const wipeDbMutation = useWipeDatabase();
  const deactivateDemoMutation = useDeactivateDemoMode();
  return (
    <Alert
      styles={{ wrapper: { alignItems: "center" }, body: { gap: rem(5) } }}
      variant="light"
      color="green"
      title="Demo material"
      icon={<IconInfoCircle />}>
      <Text size="sm">
        The Lute database has been loaded with a{" "}
        <Button
          fw="normal"
          td="none"
          variant="light"
          size="compact-sm"
          renderRoot={(props) => (
            <Link
              to="/books/$bookId/pages/$pageNum"
              params={{ bookId: tutorialBookId, pageNum: 1 }}
              {...props}
            />
          )}>
          brief tutorial
        </Button>
        , some languages and short texts for you to try out. When you&apos;re
        done trying out the demo,{" "}
        <Button
          p={0}
          styles={{ root: { verticalAlign: "unset" } }}
          onClick={() => wipeDbMutation.mutate()}
          size="compact-sm"
          variant="transparent"
          fw="normal">
          clear out the database
        </Button>{" "}
        <em>(this removes everything in the db)</em>. Or instead,{" "}
        <Button
          p={0}
          styles={{ root: { verticalAlign: "unset" } }}
          onClick={() => deactivateDemoMutation.mutate()}
          size="compact-sm"
          variant="transparent"
          fw="normal">
          dismiss this message.
        </Button>
      </Text>
    </Alert>
  );
}
