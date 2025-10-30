import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Divider, Group, Stack, Text } from "@mantine/core";
import { Checkbox } from "../../../../components/common/Checkbox/Checkbox";
import { TagsInput } from "../../../../components/common/TagsInput/TagsInput";
import { StatusRadio } from "../StatusRadio/StatusRadio";
import { FormButtons } from "../../../../components/common/FormButtons/FormButtons";
import { queries } from "../../api/queries";

function BulkTermForm({ terms }: { terms: number[] }) {
  const { data: tags } = useQuery(queries.tagSuggestions());

  const { control } = useForm({
    defaultValues: {
      convertToLowerCase: false,
      removeParents: false,
      changeStatus: false,
      status: false,
      parent: [],
      tagsAdd: [],
      tagsRemove: [],
    },
  });

  return (
    <>
      <Text
        fs="italic"
        mb={16}
        component="p"
        size="sm">{`Updating ${terms.length} term(s)`}</Text>
      <form>
        <Stack gap={5}>
          <Checkbox
            name="convertToLowerCase"
            control={control}
            label="Convert to lowercase"
          />
          <Checkbox
            name="removeParents"
            control={control}
            label="Remove parents"
          />
          <Group>
            <Checkbox
              name="changeStatus"
              control={control}
              label="Change status"
            />
            <Controller
              name="status"
              control={control}
              render={({ field: { value, ref, ...field } }) => (
                <StatusRadio {...field} value={String(value)} />
              )}
            />
          </Group>
          <Divider mt={5} mb={5} />
          <TagsInput
            name="parent"
            control={control}
            placeholder="Parent (Limit: one)"
            maxTags={1}
          />
          <TagsInput
            name="tagsAdd"
            control={control}
            placeholder="Tags to add"
            data={tags || []}
          />
          <TagsInput
            name="tagsRemove"
            control={control}
            placeholder="Tags to remove"
            data={tags || []}
          />
        </Stack>

        <FormButtons />
      </form>
    </>
  );
}

export default BulkTermForm;
