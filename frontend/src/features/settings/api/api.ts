import { apiClient } from "#utils/apiClient";
import type {
  AppInfoResponse,
  BackupsResponse,
  Highlights,
  InitialResponse,
  SettingsForm,
  ShortcutsForm,
} from "./types";

const BASE_URL = "";

export const api = {
  getInitialState(): Promise<InitialResponse> {
    return apiClient.get(`${BASE_URL}/initial`);
  },

  getAppInfo(): Promise<AppInfoResponse> {
    return apiClient.get(`${BASE_URL}/appinfo`);
  },

  getShortcuts(): Promise<ShortcutsForm> {
    return apiClient.get(`${BASE_URL}/shortcuts`);
  },

  getBackupInfo(): Promise<BackupsResponse> {
    return apiClient.get(`${BASE_URL}/backups`);
  },

  getSettingsFormValues(): Promise<SettingsForm> {
    return apiClient.get(`${BASE_URL}/settings/form`);
  },

  getThemeFormValues(): Promise<Highlights> {
    return apiClient.get(`${BASE_URL}/theme/form`);
  },

  clearDemoData() {
    return apiClient.delete(`${BASE_URL}/settings/db`);
  },

  deactivateDemoMode() {
    return apiClient.patch(`${BASE_URL}/settings/db`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deactiveDemo: true }),
    });
  },
};
