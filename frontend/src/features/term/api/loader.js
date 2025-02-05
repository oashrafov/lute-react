import { userLanguagesQuery } from "@language/api/query";
import { initialQuery } from "@settings/api/settings";
import { getTagsQuery, getTagSuggestionsQuery } from "./query";

function loader(queryClient) {
  return async () => {
    const defListData = await queryClient.ensureQueryData(userLanguagesQuery);
    const tagSuggestionsData = await queryClient.ensureQueryData(
      getTagSuggestionsQuery
    );
    const tagsData = await queryClient.ensureQueryData(getTagsQuery);
    const initialData = await queryClient.ensureQueryData(initialQuery);

    return { defListData, initialData, tagsData, tagSuggestionsData };
  };
}

export default loader;
