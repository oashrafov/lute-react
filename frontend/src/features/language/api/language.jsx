import { keys } from "./keys";

const definedLangInfoQuery = (id) => ({
  queryKey: keys.defined(id),
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/languages/${id}`);
    return await response.json();
  },
  enabled: id != null && id !== "0",
  refetchOnWindowFocus: false,
});

const defFormSettingsQuery = (id) => ({
  queryKey: keys.definedFormSettings(id),
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/${id}/settings`
    );
    return await response.json();
  },
  enabled: id != null && id !== "0",
});

const predefFormSettingsQuery = (langName) => ({
  queryKey: keys.predefinedFormSettings(langName),
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/new/${langName}`
    );
    return await response.json();
  },
  staleTime: Infinity,
});

const predefinedListQuery = {
  queryKey: keys.predefined,
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/predefined`
    );
    return await response.json();
  },
  staleTime: Infinity,
};

const definedListQuery = {
  queryKey: keys.user,
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/languages/user`);
    return await response.json();
  },
};

const parsersQuery = {
  queryKey: keys.parsers,
  queryFn: async () => {
    const response = await fetch("http://localhost:5001/api/languages/parsers");
    return await response.json();
  },
  staleTime: Infinity,
};

export {
  definedListQuery,
  predefinedListQuery,
  parsersQuery,
  definedLangInfoQuery,
  defFormSettingsQuery,
  predefFormSettingsQuery,
};
