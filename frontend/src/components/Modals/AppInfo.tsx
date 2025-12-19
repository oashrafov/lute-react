import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, Text } from "@mantine/core";
import { query } from "#settings/api/query";

export function AppInfo() {
  const { data } = useSuspenseQuery(query.appInfo());
  return (
    <>
      <Text>
        <b>LUTE</b>: Learning Using Texts v3
      </Text>
      <Text>
        <b>Version</b>: {data.version}
      </Text>
      <Text>
        <b>Data path</b>: {data.luteDbDirectory}
      </Text>
      <Text>
        <b>Database</b>: {data.luteDb}
      </Text>
      {data.isDocker && (
        <Text>
          <em>
            Note these are paths in your container, not on the host. You mounted
            host paths when you started the container.
          </em>
        </Text>
      )}

      <Stack mt="md" gap={0}>
        <Text>
          <b>Repository</b>:{" "}
          <a href="https://github.com/LuteOrg/lute-v3" target="_blank">
            lute-v3
          </a>
        </Text>
        <Text>Lute is released under the MIT License.</Text>
      </Stack>
    </>
  );
}
