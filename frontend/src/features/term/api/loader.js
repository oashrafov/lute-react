import { definedListQuery } from "@language/api/language";
import { initialQuery } from "@settings/api/settings";
import { getTagsQuery, getTagSuggestionsQuery } from "./query";

function loader(queryClient) {
  return async () => {
    const defListData = await queryClient.ensureQueryData(definedListQuery);
    const tagSuggestionsData = await queryClient.ensureQueryData(
      getTagSuggestionsQuery
    );
    const tagsData = await queryClient.ensureQueryData(getTagsQuery);
    const initialData = await queryClient.ensureQueryData(initialQuery);

    return { defListData, initialData, tagsData, tagSuggestionsData };
  };
}

export default loader;
