import { queryOptions } from "@tanstack/react-query";
import {
  getBackupInfo,
  getInitialState,
  getSettingsFormInitValues,
  getShortcuts,
  getAppInfo,
  getThemeFormInitValues,
} from "./api";

export const queries = {
  init: () =>
    queryOptions({
      queryKey: ["init"],
      queryFn: getInitialState,
      staleTime: Infinity,
    }),
  settingsForm: () =>
    queryOptions({
      queryKey: ["settingsForm"],
      queryFn: getSettingsFormInitValues,
    }),
  themeForm: () =>
    queryOptions({
      queryKey: ["themeForm"],
      queryFn: getThemeFormInitValues,
    }),
  shortcuts: () =>
    queryOptions({
      queryKey: ["shortcuts"],
      queryFn: getShortcuts,
    }),
  appInfo: () =>
    queryOptions({
      queryKey: ["appinfo"],
      queryFn: getAppInfo,
      staleTime: Infinity,
    }),
  backups: () =>
    queryOptions({ queryKey: ["backups"], queryFn: getBackupInfo }),
} as const;
