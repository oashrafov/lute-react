import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";

export const query = {
  init: () =>
    queryOptions({
      queryKey: ["init"],
      queryFn: api.getInitialState,
      staleTime: Infinity,
    }),
  settingsForm: () =>
    queryOptions({
      queryKey: ["settingsForm"],
      queryFn: api.getSettingsFormValues,
    }),
  themeForm: () =>
    queryOptions({
      queryKey: ["themeForm"],
      queryFn: api.getThemeFormValues,
    }),
  shortcuts: () =>
    queryOptions({
      queryKey: ["shortcuts"],
      queryFn: api.getShortcuts,
    }),
  appInfo: () =>
    queryOptions({
      queryKey: ["appinfo"],
      queryFn: api.getAppInfo,
      staleTime: Infinity,
    }),
  backups: () =>
    queryOptions({ queryKey: ["backups"], queryFn: api.getBackupInfo }),
} as const;
