import { getBooksQuery } from "@book/api/query";
import { predefinedListQuery } from "@language/api/language";
import {
  initialQuery,
  settingsQuery,
  softwareInfoQuery,
} from "@settings/api/settings";

function loader(queryClient) {
  return async () => {
    const softwareInfoData =
      await queryClient.ensureQueryData(softwareInfoQuery);
    const settingsData = await queryClient.ensureQueryData(settingsQuery);
    const allBooksData = await queryClient.ensureQueryData(getBooksQuery);
    const initialData = await queryClient.ensureQueryData(initialQuery);
    const predefLangListData =
      await queryClient.ensureQueryData(predefinedListQuery);

    return {
      settingsData,
      allBooksData,
      initialData,
      softwareInfoData,
      predefLangListData,
    };
  };
}

export default loader;
