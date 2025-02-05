import { getBookQuery, getPageQuery } from "./query";
import { userLanguageQuery } from "@language/api/query";
import { settingsQuery } from "@settings/api/settings";
import { softwareInfoQuery } from "@settings/api/settings";

function loader(queryClient) {
  return async ({ params }) => {
    const bookData = await queryClient.ensureQueryData(getBookQuery(params.id));
    const pageData = await queryClient.ensureQueryData(
      getPageQuery(params.id, params.page)
    );

    const settingsData = await queryClient.ensureQueryData(settingsQuery);
    const languageData = await queryClient.ensureQueryData(
      userLanguageQuery(bookData?.languageId)
    );
    const softwareInfoData =
      await queryClient.ensureQueryData(softwareInfoQuery);

    return {
      bookData,
      pageData,
      settingsData,
      languageData,
      softwareInfoData,
    };
  };
}

export default loader;
