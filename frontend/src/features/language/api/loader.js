import { initialQuery } from "@settings/api/settings";
import {
  userLanguagesQuery,
  parsersQuery,
  predefinedLanguagesQuery,
} from "./query";

function loader(queryClient) {
  return async () => {
    const predefListData = await queryClient.ensureQueryData(
      predefinedLanguagesQuery
    );
    const defListData = await queryClient.ensureQueryData(userLanguagesQuery);
    const parsersData = await queryClient.ensureQueryData(parsersQuery);
    const initialData = await queryClient.ensureQueryData(initialQuery);

    return {
      predefListData,
      defListData,
      parsersData,
      initialData,
    };
  };
}

export default loader;
