import { queryOptions } from "@tanstack/react-query";
import {
  getBackupInfo,
  getInitialState,
  getSettings,
  getShortcuts,
  getAppInfo,
} from "./api";

export const queries = {
  init: () =>
    queryOptions({
      queryKey: ["init"],
      queryFn: getInitialState,
      staleTime: Infinity,
    }),
  settings: () =>
    queryOptions({
      queryKey: ["settings"],
      queryFn: getSettings,
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
