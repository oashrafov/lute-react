import { BASE_API_URL } from "../../../resources/constants";

export const endpoints = {
  getSettings: `${BASE_API_URL}/settings`,
  getShortcuts: `${BASE_API_URL}/shortcuts`,
  getAppInfo: `${BASE_API_URL}/appinfo`,
  getInitialState: `${BASE_API_URL}/initial`,
  getBackupInfo: `${BASE_API_URL}/backups`,
  wipeDemoDatabase: `${BASE_API_URL}/settings/db`,
  deactivateDemoMode: `${BASE_API_URL}/settings/db`,
} as const;
