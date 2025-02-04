import { keys } from "./keys";

const settingsQuery = {
  queryKey: keys.settings,
  queryFn: async () => {
    const res = await fetch("http://localhost:5001/api/settings");
    return await res.json();
  },
};

const shortcutsQuery = {
  queryKey: keys.shortcuts,
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/shortcuts`);
    return await response.json();
  },
};

const softwareInfoQuery = {
  queryKey: keys.version,
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/appinfo`);
    return await response.json();
  },
  staleTime: Infinity,
};

const initialQuery = {
  queryKey: keys.initial,
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/initial`);
    return await response.json();
  },
  staleTime: Infinity,
};

export { settingsQuery, shortcutsQuery, softwareInfoQuery, initialQuery };
